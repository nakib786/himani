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

type Action =
  | { type: 'hydrate'; state: Pick<State, 'lines' | 'giftMessage'> }
  | { type: 'add'; item: CartSnapshot; quantity: number }
  | { type: 'remove'; slug: string }
  | { type: 'setQuantity'; slug: string; quantity: number }
  | { type: 'setGiftWrap'; slug: string; giftWrap: boolean }
  | { type: 'setGiftMessage'; message: string }
  | { type: 'clear' };

const MAX_PER_LINE = 10;
const STORAGE_KEY = 'ksh_cart_v1';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state, hydrated: true };

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
      return { ...state, giftMessage: action.message.slice(0, 240) };

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

  /* Restore from localStorage once, on mount. */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        dispatch({
          type: 'hydrate',
          state: {
            lines: Array.isArray(parsed.lines) ? parsed.lines : [],
            giftMessage: typeof parsed.giftMessage === 'string' ? parsed.giftMessage : '',
          },
        });
      } else {
        dispatch({ type: 'hydrate', state: { lines: [], giftMessage: '' } });
      }
    } catch {
      // A corrupt or unavailable store must never break the page.
      dispatch({ type: 'hydrate', state: { lines: [], giftMessage: '' } });
    }
    persistReady.current = true;
  }, []);

  /* Persist after hydration — never write the empty initial state over a
     real cart before we have read it back. */
  useEffect(() => {
    if (!persistReady.current || !state.hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lines: state.lines, giftMessage: state.giftMessage }),
      );
    } catch {
      /* Private mode / quota — the cart still works for this session. */
    }
  }, [state.lines, state.giftMessage, state.hydrated]);

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
