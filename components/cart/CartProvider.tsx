'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

/**
 * Cart state.
 *
 * Each line carries its own price/title/image snapshot rather than looking the
 * product up client-side. That keeps the whole catalogue out of the client
 * bundle — at 100+ SKUs shipping a product map to every page would be dead
 * weight — and it means a cart survives a product being renamed mid-session.
 * Prices are re-verified server-side at checkout; the snapshot is for display.
 */
export type CartLine = {
  slug: string;
  title: string;
  price: number;
  mrp: number;
  image: string;
  imageAlt: string;
  netQuantity: string;
  quantity: number;
  giftWrap: boolean;
};

export type CartSnapshot = Omit<CartLine, 'quantity' | 'giftWrap'>;

type State = {
  lines: CartLine[];
  giftMessage: string;
  hydrated: boolean;
};

type StoredCart = Pick<State, 'lines' | 'giftMessage'>;

type Action =
  | { type: 'hydrate'; state: StoredCart }
  | { type: 'sync'; state: StoredCart }
  | { type: 'add'; item: CartSnapshot; quantity: number }
  | { type: 'remove'; slug: string }
  | { type: 'setQuantity'; slug: string; quantity: number }
  | { type: 'setGiftWrap'; slug: string; giftWrap: boolean }
  | { type: 'setGiftMessage'; message: string }
  | { type: 'clear' };

const MAX_PER_LINE = 10;
const STORAGE_KEY = 'ksh_cart_v1';
const MAX_GIFT_MESSAGE = 240;

const EMPTY_CART: StoredCart = { lines: [], giftMessage: '' };

/**
 * Coerce one stored entry back into a CartLine, or reject it.
 *
 * Everything in localStorage is untrusted input: it may predate a schema
 * change, have been hand-edited, or have been half-written when a tab died.
 * A failing line is dropped rather than patched up — losing one line is much
 * better than a NaN reaching the subtotal, or an empty `image` reaching
 * next/image, which throws and would take the whole bag down with it.
 */
function parseLine(raw: unknown): CartLine | null {
  if (!raw || typeof raw !== 'object') return null;
  const line = raw as Record<string, unknown>;

  const text = (v: unknown) => (typeof v === 'string' && v.length > 0 ? v : null);
  const money = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;

  const slug = text(line.slug);
  const title = text(line.title);
  const image = text(line.image);
  const price = money(line.price);
  const mrp = money(line.mrp);
  const quantity = money(line.quantity);

  if (!slug || !title || !image) return null;
  if (price === null || mrp === null) return null;
  if (quantity === null || quantity < 1) return null;

  return {
    slug,
    title,
    price,
    mrp,
    image,
    // Cosmetic only — an empty alt is valid HTML, so these need no rejection.
    imageAlt: typeof line.imageAlt === 'string' ? line.imageAlt : '',
    netQuantity: typeof line.netQuantity === 'string' ? line.netQuantity : '',
    quantity: Math.min(MAX_PER_LINE, Math.floor(quantity)),
    giftWrap: line.giftWrap === true,
  };
}

/** Parse a raw localStorage payload into a cart. Never throws. */
function parseCart(raw: string | null): StoredCart {
  if (!raw) return EMPTY_CART;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return EMPTY_CART;
    const source = parsed as Record<string, unknown>;

    const lines: CartLine[] = [];
    const seen = new Set<string>();
    if (Array.isArray(source.lines)) {
      for (const entry of source.lines) {
        const line = parseLine(entry);
        // Every reducer case keys off slug, so a duplicate would make quantity
        // edits ambiguous and unremovable. First occurrence wins.
        if (line && !seen.has(line.slug)) {
          seen.add(line.slug);
          lines.push(line);
        }
      }
    }

    return {
      lines,
      giftMessage:
        typeof source.giftMessage === 'string'
          ? source.giftMessage.slice(0, MAX_GIFT_MESSAGE)
          : '',
    };
  } catch {
    // Corrupt or unavailable store must never break the page.
    return EMPTY_CART;
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state, hydrated: true };

    /* Another tab changed the cart. Adopt its state wholesale — last write
       wins, which matches what the shopper sees in the tab they just used. */
    case 'sync':
      return { ...state, ...action.state };

    case 'add': {
      const existing = state.lines.find((l) => l.slug === action.item.slug);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.slug === action.item.slug
              ? { ...l, quantity: Math.min(MAX_PER_LINE, l.quantity + action.quantity) }
              : l,
          ),
        };
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          {
            ...action.item,
            quantity: Math.min(MAX_PER_LINE, action.quantity),
            giftWrap: false,
          },
        ],
      };
    }

    case 'remove':
      return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) };

    case 'setQuantity': {
      if (action.quantity < 1) {
        return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.slug === action.slug
            ? { ...l, quantity: Math.min(MAX_PER_LINE, action.quantity) }
            : l,
        ),
      };
    }

    case 'setGiftWrap':
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.slug === action.slug ? { ...l, giftWrap: action.giftWrap } : l,
        ),
      };

    case 'setGiftMessage':
      return { ...state, giftMessage: action.message.slice(0, MAX_GIFT_MESSAGE) };

    case 'clear':
      return { ...state, lines: [], giftMessage: '' };

    default:
      return state;
  }
}

const initialState: State = { lines: [], giftMessage: '', hydrated: false };

type CartContextValue = {
  lines: CartLine[];
  giftMessage: string;
  hydrated: boolean;
  count: number;
  subtotal: number;
  savings: number;
  isOpen: boolean;
  /** Announced politely to screen readers after an add. */
  lastAction: string;
  add: (item: CartSnapshot, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  setGiftWrap: (slug: string, giftWrap: boolean) => void;
  setGiftMessage: (message: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const persistReady = useRef(false);
  /** Raw JSON we last read or wrote, used to suppress redundant writes. */
  const lastPersisted = useRef<string | null>(null);

  /* Restore from localStorage once, on mount. */
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* Private mode / storage disabled — fall through to an empty bag. */
    }
    lastPersisted.current = raw;
    dispatch({ type: 'hydrate', state: parseCart(raw) });
    persistReady.current = true;
  }, []);

  /* Persist after hydration — never write the empty initial state over a
     real cart before we have read it back. */
  useEffect(() => {
    if (!persistReady.current || !state.hydrated) return;
    const serialised = JSON.stringify({
      lines: state.lines,
      giftMessage: state.giftMessage,
    });
    // Skip no-op writes. Beyond saving a write, this is what stops two tabs
    // echoing each other forever: a synced tab would otherwise re-persist the
    // value it just received, waking the tab that sent it, and so on.
    if (serialised === lastPersisted.current) return;
    lastPersisted.current = serialised;
    try {
      window.localStorage.setItem(STORAGE_KEY, serialised);
    } catch {
      /* Private mode / quota — the cart still works for this session. */
    }
  }, [state.lines, state.giftMessage, state.hydrated]);

  /* Adopt changes made in other tabs. `storage` fires only in tabs other than
     the one that wrote, so this cannot see our own writes. Without it, a tab
     holding stale state overwrites another tab's additions on its next edit. */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.storageArea !== window.localStorage) return;
      lastPersisted.current = e.newValue;
      // A null newValue means the key was removed — treat it as an empty bag.
      dispatch({ type: 'sync', state: parseCart(e.newValue) });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /* Lock the page behind the drawer, and close on Escape. */
  useEffect(() => {
    document.body.dataset.locked = isOpen ? 'true' : 'false';
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const add = useCallback((item: CartSnapshot, quantity = 1) => {
    dispatch({ type: 'add', item, quantity });
    setLastAction(`${item.title} added to your bag`);
    setIsOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    dispatch({ type: 'remove', slug });
    setLastAction('Item removed from your bag');
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = state.lines.reduce((n, l) => n + l.price * l.quantity, 0);
    const savings = state.lines.reduce((n, l) => n + (l.mrp - l.price) * l.quantity, 0);

    return {
      lines: state.lines,
      giftMessage: state.giftMessage,
      hydrated: state.hydrated,
      count,
      subtotal,
      savings,
      isOpen,
      lastAction,
      add,
      remove,
      setQuantity: (slug, quantity) => dispatch({ type: 'setQuantity', slug, quantity }),
      setGiftWrap: (slug, giftWrap) => dispatch({ type: 'setGiftWrap', slug, giftWrap }),
      setGiftMessage: (message) => dispatch({ type: 'setGiftMessage', message }),
      clear: () => dispatch({ type: 'clear' }),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  }, [state, isOpen, lastAction, add, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
