import type { JournalPost } from './types';

/**
 * The journal.
 *
 * Eight launch posts, each written against a descriptive query real people
 * type — because "Kshyovrata" is a query nobody types yet (brief §8). The
 * point of every post is to be genuinely more useful than the thin listicle
 * currently ranking for the same phrase; thin SEO filler would rank for a
 * fortnight and then not at all.
 *
 * Post 6 deliberately explains why we do not make the skin-safety claim our
 * own marketplace listings make. That is a risk worth taking: it is the most
 * searched question in this category and the honest answer is the differentiator.
 */

export const JOURNAL: JournalPost[] = [
  /* ---------------------------------------------------------------- 01 --- */
  {
    slug: 'keep-gold-plated-jewellery-from-tarnishing',
    title: 'How to Keep Gold-Plated Jewellery From Tarnishing',
    targetQuery: 'how to keep gold plated jewellery from tarnishing',
    excerpt:
      'Plating is a few microns of gold over a base metal. Everything about making it last comes down to keeping those microns intact.',
    publishedAt: '2026-08-13',
    readingMinutes: 5,
    body: [
      {
        type: 'p',
        text: 'Gold-plated jewellery does not tarnish the way silver does. What actually happens is simpler and slower: the thin layer of gold on the surface wears through in the places that rub, and the base metal underneath starts to oxidise where it is exposed. Once you understand that, every care instruction stops being folklore and starts being obvious.',
      },
      { type: 'h2', text: 'What actually damages plating' },
      {
        type: 'list',
        items: [
          'Friction — the inside of a ring, the back of a pendant against a collarbone, chain links rubbing each other in a drawer',
          'Acids and salts — sweat is both, which is why the clasp and the back of a pendant go first',
          'Alcohol and solvents — perfume, hairspray, sanitiser, most cleaning products',
          'Chlorinated and salt water — a swimming pool will do more damage in an afternoon than a month of ordinary wear',
          'Heat and steam — a hot shower, a kitchen, a hair straightener held too close',
        ],
      },
      { type: 'h2', text: 'The order you put things on' },
      {
        type: 'p',
        text: 'Jewellery goes on last and comes off first. Moisturiser, perfume and hairspray all need to be dry on your skin before metal touches it. This one habit does more for plating than any cleaning routine, because it stops the damage instead of treating it.',
      },
      { type: 'h2', text: 'Cleaning without stripping' },
      {
        type: 'p',
        text: 'Most of the time, a dry wipe with a soft lint-free cloth after wearing is the whole job. It lifts off sweat and skin oils before they sit overnight. Save wet cleaning for when a piece is visibly dull.',
      },
      {
        type: 'list',
        items: [
          'Lukewarm water with a few drops of mild dish soap — nothing stronger',
          'Two to three minutes of soaking, not twenty',
          'A soft toothbrush, used gently, only where dirt has collected in a setting',
          'Rinse in clean water and pat completely dry before storing',
        ],
      },
      {
        type: 'note',
        text: 'Never use toothpaste, baking soda, vinegar, or a silver-polishing cloth on plated jewellery. All four are abrasive or acidic, and they take the gold off faster than any amount of wear.',
      },
      { type: 'h2', text: 'Storage matters more than people think' },
      {
        type: 'p',
        text: 'A pile of chains in one box is a plating problem: every piece is quietly sanding every other piece. Store items separately, in a pouch or a compartment box, somewhere dry. A silica sachet in the drawer is worth the ten rupees it costs, particularly through a coastal monsoon.',
      },
      { type: 'h2', text: 'Rotate what you wear' },
      {
        type: 'p',
        text: 'The single most effective thing you can do is own more than one piece and alternate. Plating recovers nothing, but wear that is spread across three pairs of earrings takes three times as long to show on any one of them. It is also, conveniently, the argument for a small capsule rather than one piece worn to death.',
      },
    ],
    relatedSlugs: ['what-skin-friendly-actually-means', 'everyday-office-jewellery-capsule'],
  },

  /* ---------------------------------------------------------------- 02 --- */
  {
    slug: 'what-skin-friendly-actually-means',
    title: 'What "Skin-Friendly" Actually Means in Fashion Jewellery',
    targetQuery: 'what does skin friendly mean jewellery nickel free',
    excerpt:
      'It is not a regulated term. Here is what it usually stands in for, what causes reactions, and what a seller should be able to tell you.',
    publishedAt: '2026-08-13',
    readingMinutes: 6,
    body: [
      {
        type: 'p',
        text: 'Search fashion jewellery on any Indian marketplace and almost every listing says skin-friendly. It is worth knowing that the phrase means nothing in particular. There is no standard behind it, no test that certifies it, and no authority that checks it. It is a marketing word.',
      },
      { type: 'h2', text: 'What actually causes reactions' },
      {
        type: 'p',
        text: 'Overwhelmingly, nickel. Contact allergy to nickel affects a substantial minority of people, women more often than men, and it is the reason cheap earrings make some earlobes itch, redden or weep. Lead and cadmium are separate concerns — they are toxicity issues rather than allergy ones, and they are restricted in jewellery in the EU and parts of the US.',
      },
      {
        type: 'p',
        text: 'Plated jewellery complicates this. A nickel-containing base metal under a gold surface is fine while the plating is intact and becomes a problem once it wears through — which is exactly where jewellery sits against skin most, at the earring post and the clasp.',
      },
      { type: 'h2', text: 'The questions that get real answers' },
      {
        type: 'list',
        items: [
          'What is the base metal? Brass, copper alloy and surgical stainless steel behave very differently',
          'Is it nickel-free, and is that tested or assumed?',
          'How thick is the plating, in microns? Under 0.5 is flash plating; 2.5 and up is meaningfully durable',
          'What are the earring posts made of? Often a different metal from the body of the piece',
          'Is there any test report, and from whom?',
        ],
      },
      {
        type: 'p',
        text: 'A seller who can answer those five questions is telling you something. A seller who only repeats "skin-friendly" is telling you nothing at all.',
      },
      { type: 'h2', text: 'Where we stand' },
      {
        type: 'p',
        text: 'Our own marketplace listings carry the skin-friendly line, and on this site we have taken it off. Not because we think our pieces are a problem — we have had no complaints — but because we cannot yet show you a base metal, a plating thickness or a nickel test, and a claim you cannot evidence is not a claim, it is a hope.',
      },
      {
        type: 'p',
        text: 'We have asked our manufacturer for those figures. When they arrive, they will appear on every product page, whatever they say. Until then the product pages describe what is observable: the weight, the finish, and the absence of rough edges.',
      },
      { type: 'h2', text: 'If you already know you react' },
      {
        type: 'list',
        items: [
          'Look for surgical stainless steel or titanium posts specifically, not just a nickel-free body',
          'Take earrings out before sleeping and before showering',
          'Retire a piece once you can see base metal through the plating — that is when contact starts',
          'A clear barrier coat on the post is a stopgap, not a fix',
        ],
      },
      {
        type: 'note',
        text: 'This is general information, not medical advice. Persistent skin reactions are worth taking to a dermatologist, who can patch-test for nickel specifically.',
      },
    ],
    relatedSlugs: [
      'keep-gold-plated-jewellery-from-tarnishing',
      'jewellery-gifts-under-1000',
    ],
  },

  /* ---------------------------------------------------------------- 03 --- */
  {
    slug: 'gold-vs-rose-gold-skin-tone',
    title: 'Gold vs Rose Gold: Which Suits Your Skin Tone?',
    targetQuery: 'gold or rose gold for indian skin tone',
    excerpt:
      'A practical way to decide, using the veins on your wrist and a white sheet of paper — and why the rule breaks more often than it holds.',
    publishedAt: '2026-08-13',
    readingMinutes: 4,
    body: [
      {
        type: 'p',
        text: 'The conventional advice is that warm undertones suit yellow gold and cool undertones suit silver, with rose gold sitting in between and flattering almost everyone. It is a useful starting point and it is wrong often enough to be worth testing rather than trusting.',
      },
      { type: 'h2', text: 'Two ways to find your undertone' },
      {
        type: 'list',
        items: [
          'Look at the veins on the inside of your wrist in daylight. Green-looking veins suggest a warm undertone; blue or purple suggests cool; a mix means neutral, which is the most common result on Indian skin',
          'Hold a sheet of plain white paper next to your bare face. Skin that looks golden or peachy against it reads warm; skin that looks pink or slightly blue reads cool',
        ],
      },
      { type: 'h2', text: 'What tends to work' },
      {
        type: 'p',
        text: 'Yellow gold is the safest choice across the widest range of Indian skin tones, which is partly aesthetics and partly two thousand years of habit — it is what jewellery here has always been. It reads warmest against deeper complexions and holds its own against strong colour, which is why it survives a red or maroon saree that would swallow a paler metal.',
      },
      {
        type: 'p',
        text: 'Rose gold is copper-heavy, which makes it softer and pinker. It is genuinely flattering on cool and neutral undertones, and it does something particular on fair-to-medium skin: it disappears slightly into the skin rather than sitting on top of it. That subtlety is the point, and also the reason it can look washed out on very fair skin under harsh light.',
      },
      { type: 'h2', text: 'The rule that actually matters' },
      {
        type: 'p',
        text: 'Undertone decides less than context does. What you are wearing, the light you will be in, and whether you already own gold that this piece has to sit beside will all outrank the vein test. Rose gold against a pastel or a muted palette is quietly excellent. The same piece against a heavily embroidered festive outfit often just looks uncertain.',
      },
      { type: 'h2', text: 'And mixing them' },
      {
        type: 'p',
        text: 'Mixing metals is fine, and has been for a decade. The trick is to make it look decided rather than accidental: keep one metal dominant, let the second appear at least twice so it reads as a choice, and keep the pieces in a similar visual weight. One delicate rose gold chain under one heavy yellow gold pendant reads as an accident.',
      },
    ],
    relatedSlugs: ['chain-length-guide-indian-necklines', 'festive-jewellery-edit'],
  },

  /* ---------------------------------------------------------------- 04 --- */
  {
    slug: 'chain-length-guide-indian-necklines',
    title: 'Chain Length Guide for Indian Necklines',
    targetQuery: 'necklace chain length guide india which length',
    excerpt:
      'Which length sits where, what it does to a kurta, a saree blouse and a shirt collar, and why adjustable chains solve most of it.',
    publishedAt: '2026-08-13',
    readingMinutes: 4,
    body: [
      {
        type: 'p',
        text: 'Necklace length is measured as the full circumference of the chain, not the drop. A 16-inch chain does not hang 16 inches down; it makes a 16-inch loop, which on most adults lands on or just below the collarbone.',
      },
      { type: 'h2', text: 'The lengths, and what they do' },
      {
        type: 'list',
        items: [
          '14–16 inches — sits at the base of the neck. Works with boat necks, high necks and closed collars, where anything longer disappears into fabric',
          '16–18 inches — collarbone or just below. The default for a single pendant, and the most forgiving across necklines',
          '20–22 inches — a few inches lower, sitting on the sternum. Suits kurtas, deeper V-necks, and layering over a shorter chain',
          '24 inches and above — at or below the sternum. Built for sarees, long jackets and high-neck blouses where the eye needs somewhere to travel',
        ],
      },
      { type: 'h2', text: 'Matching length to neckline' },
      {
        type: 'p',
        text: 'The general principle: a pendant should sit inside the shape the neckline makes, not fight it. A V-neck wants something that stops above the point of the V. A round neck wants a chain shorter or clearly longer than the neckline itself — landing exactly on the edge looks unresolved. A high-neck blouse or a closed collar is the one case where a long chain worn over the fabric is better than a short one worn under it.',
      },
      { type: 'h2', text: 'Sarees specifically' },
      {
        type: 'p',
        text: 'A saree blouse neckline varies far more than western sizing does, which is exactly why fixed-length chains are frustrating here. If you wear sarees regularly, an adjustable chain is not a convenience, it is the only thing that works across your own wardrobe.',
      },
      { type: 'h2', text: 'Layering' },
      {
        type: 'p',
        text: 'Leave at least two inches between layers, so each chain has its own line and the pendants do not tangle. Two layers reads as deliberate; three needs the lengths to be genuinely distinct. Mixing chain weights — a fine box link under a slightly heavier one — separates the layers better than mixing lengths alone.',
      },
      {
        type: 'note',
        text: 'Both of our necklaces adjust — one on a box-link extender, one on a slider — so they cover the princess-to-matinee range without you having to pick a number.',
      },
    ],
    relatedSlugs: ['gold-vs-rose-gold-skin-tone', 'style-a-butterfly-pendant'],
  },

  /* ---------------------------------------------------------------- 05 --- */
  {
    slug: 'style-a-butterfly-pendant',
    title: 'How to Style a Butterfly Pendant — Ethnic and Western',
    targetQuery: 'how to style butterfly pendant necklace',
    excerpt:
      'A butterfly reads young by default. Four ways to wear one so it reads considered instead.',
    publishedAt: '2026-08-13',
    readingMinutes: 4,
    body: [
      {
        type: 'p',
        text: 'The butterfly has a reputation problem: done badly it reads like something from a school fete. Almost all of that comes down to two variables — scale and whether the shape is filled or drawn. A small open outline behaves completely differently from a large enamelled one, and it is the outline version that works past the age of twenty.',
      },
      { type: 'h2', text: 'With a shirt' },
      {
        type: 'p',
        text: 'A collared shirt with the top two buttons open makes a natural frame. Keep the pendant short enough to sit inside that opening rather than below it. This is the most office-safe way to wear a motif pendant — the collar does the formalising, so the pendant is allowed to be playful.',
      },
      { type: 'h2', text: 'With a kurta' },
      {
        type: 'p',
        text: 'Kurtas usually want length. A single small pendant on a longer chain sits well against a plain kurta, and against a printed one you want the chain longer still so the pendant clears the busiest part of the print. Skip it entirely on heavy embroidery at the neckline — the pendant loses.',
      },
      { type: 'h2', text: 'With a saree' },
      {
        type: 'p',
        text: 'This is the hardest case, and the answer is usually contrast. A delicate outline butterfly against a heavily worked saree is a deliberately quiet choice and looks it. What does not work is a mid-scale butterfly against mid-scale zari — two things competing at the same volume.',
      },
      { type: 'h2', text: 'Layered' },
      {
        type: 'p',
        text: 'A butterfly pendant makes a good bottom layer under a plain shorter chain, because the eye reads the plain chain first and the motif second. Reverse that order and the butterfly announces itself, which is the thing you were trying to avoid.',
      },
      { type: 'h2', text: 'What to pair it with' },
      {
        type: 'list',
        items: [
          'Small studs, never a second motif — one story per outfit',
          'A watch with a plain face, if you wear one',
          'Nothing else at the neck',
          'If you want to repeat the motif, do it once and at a different scale — matching butterfly earrings and pendant together is the costume version',
        ],
      },
    ],
    relatedSlugs: ['chain-length-guide-indian-necklines', 'everyday-office-jewellery-capsule'],
  },

  /* ---------------------------------------------------------------- 06 --- */
  {
    slug: 'everyday-office-jewellery-capsule',
    title: 'Everyday Office Jewellery: The Five-Piece Capsule',
    targetQuery: 'office jewellery for women daily wear minimal',
    excerpt:
      'Five pieces that cover every working week without you having to think about it, and the rules that make them work together.',
    publishedAt: '2026-08-13',
    readingMinutes: 5,
    body: [
      {
        type: 'p',
        text: 'Office jewellery has one job: to look considered without becoming a topic of conversation. That rules out anything that swings, anything that catches on a headset, and anything you will spend the day adjusting.',
      },
      { type: 'h2', text: 'The five' },
      {
        type: 'list',
        items: [
          'A pair of small studs, flat enough to wear under headphones and to sleep in when you forget',
          'One fine chain with a small pendant, short enough to sit above a shirt collar',
          'A second, plain chain slightly longer — the layering partner, and the one you wear alone on the days you cannot be bothered',
          'One pair of drop earrings, kept for the days with meetings that matter',
          'A single ring or a thin bracelet — one, not both',
        ],
      },
      { type: 'h2', text: 'The rules that hold it together' },
      {
        type: 'p',
        text: 'Pick one metal and stay in it. A capsule works because the pieces are interchangeable, and the moment half of it is rose gold you have two half-capsules. Keep scale consistent too: everything in the set should be roughly the same visual weight, so any combination looks intentional.',
      },
      {
        type: 'p',
        text: 'Then set a ceiling: two categories at a time. Earrings and a necklace, or earrings and a ring — not all three. This single rule does more for looking put-together than any individual purchase.',
      },
      { type: 'h2', text: 'What to spend where' },
      {
        type: 'p',
        text: 'The studs and the plain chain get worn four or five days a week and should be the pieces you replace most often, because plating wears with use and no amount of care changes that. The drop earrings come out once a fortnight and will outlive everything else in the box. Buy accordingly.',
      },
      { type: 'h2', text: 'Making it last a year' },
      {
        type: 'p',
        text: 'Rotate. Two pairs of studs alternated will each last more than twice as long as one pair worn daily, because you are giving the plating time between exposures to sweat and skin oil. Wipe everything down at the end of the day, and store the pieces separately rather than in one dish by the door.',
      },
    ],
    relatedSlugs: [
      'keep-gold-plated-jewellery-from-tarnishing',
      'jewellery-gifts-under-1000',
    ],
  },

  /* ---------------------------------------------------------------- 07 --- */
  {
    slug: 'jewellery-gifts-under-1000',
    title: "Jewellery Gifts Under ₹1000 That Don't Look Cheap",
    targetQuery: 'jewellery gift for her under 1000 rupees',
    excerpt:
      'What actually separates a thoughtful budget gift from an obviously budget one — and it is mostly not the price.',
    publishedAt: '2026-08-13',
    readingMinutes: 5,
    body: [
      {
        type: 'p',
        text: 'Under a thousand rupees you are not buying materials, you are buying design and finish. Which is good news, because those are the two things the eye actually reads, and neither of them costs much to get right.',
      },
      { type: 'h2', text: 'What gives a cheap piece away' },
      {
        type: 'list',
        items: [
          'Visible seams or casting lines where two halves were joined',
          'A too-yellow, too-shiny plating that reads as orange under indoor light',
          'Stones set unevenly, or with glue visible around the setting',
          'Excessive weight for the size — solid where it should be hollow, which also means it comes off by lunchtime',
          'Packaging that has to be thrown away before the gift can be given',
        ],
      },
      { type: 'h2', text: 'What buys you more than the price suggests' },
      {
        type: 'p',
        text: 'Openwork. A shape cut out rather than filled in looks more expensive at every price point, because the cutting is the work and you can see it. It is also lighter, which solves the wearability problem at the same time.',
      },
      {
        type: 'p',
        text: 'Restraint in scale is the other one. A small piece executed cleanly always reads better than a large piece executed adequately. Under a thousand rupees, going big is the most common and most expensive-looking mistake.',
      },
      { type: 'h2', text: 'Choosing for someone else' },
      {
        type: 'list',
        items: [
          'Studs are the safest earring gift — no length, no swing, no guessing about what suits them',
          'An adjustable chain removes the only real sizing risk with a necklace',
          'Match the metal they already wear. Look at photographs of them rather than asking',
          'A set is a stronger gift than two separate pieces at the same total price, because it looks planned',
          'Avoid anything with an initial, a birthstone or a date unless you are certain — specificity is a gamble',
        ],
      },
      { type: 'h2', text: 'The packaging point' },
      {
        type: 'p',
        text: 'At this price the box is a real part of the gift, because it is the first thing they see and the last thing they judge. A piece that arrives ready to hand over — no separate wrapping, no marketplace branding on the outside — is worth more to the person giving it than another two hundred rupees of metal would be.',
      },
      {
        type: 'note',
        text: 'Everything we make sits between ₹399 and ₹899, and every order ships gift-ready with an optional handwritten message.',
      },
    ],
    relatedSlugs: ['festive-jewellery-edit', 'what-skin-friendly-actually-means'],
  },

  /* ---------------------------------------------------------------- 08 --- */
  {
    slug: 'festive-jewellery-edit',
    title: 'Festive Jewellery Edit: Diwali, Karwa Chauth and Raksha Bandhan',
    targetQuery: 'festive jewellery for diwali karwa chauth what to wear',
    excerpt:
      'What each occasion actually calls for, and how to wear one good piece across all three instead of buying for each.',
    publishedAt: '2026-08-13',
    readingMinutes: 5,
    body: [
      {
        type: 'p',
        text: 'The festive season compresses three or four occasions into a few weeks, each with a different dress code and, usually, the same wardrobe. The efficient answer is not a piece per festival — it is one or two flexible pieces styled differently.',
      },
      { type: 'h2', text: 'Raksha Bandhan' },
      {
        type: 'p',
        text: 'Daytime, family, usually a kurta or a light saree. The scale is smaller than people expect: this is not an evening occasion, and heavy jewellery in daylight reads as trying. Studs and a single pendant are correct. It is also the one festival where jewellery is frequently the gift itself, which makes something adjustable and unfussy the safer choice.',
      },
      { type: 'h2', text: 'Karwa Chauth' },
      {
        type: 'p',
        text: 'The most traditionally dressed of the three, and the one with the strongest existing conventions — red, gold, and often bridal jewellery brought out again. Fashion jewellery here works best as a supporting layer rather than the centrepiece: earrings that add light near the face, with the heavier traditional pieces doing the main work.',
      },
      { type: 'h2', text: 'Diwali' },
      {
        type: 'p',
        text: 'The most variable. A daytime puja and an evening party are two different briefs, and most people do both in one day. Plan around a change of earrings rather than a change of everything: keep the necklace constant, swap studs for drops after dark.',
      },
      { type: 'h2', text: 'Lighting is the thing nobody plans for' },
      {
        type: 'p',
        text: 'Festive evenings are lit by diyas, fairy lights and phone cameras — warm, low, and directional. Crystal and faceted surfaces come alive in that light in a way they simply do not under an office tube light. If you own one piece with stones in it, this is the season it earns its place.',
      },
      { type: 'h2', text: 'One set, three occasions' },
      {
        type: 'list',
        items: [
          'Raksha Bandhan: the necklace alone, at its shortest adjustment, with plain studs',
          'Karwa Chauth: the matching earrings alone, letting traditional pieces lead at the neck',
          'Diwali: the full set, at its longest adjustment, for the evening',
        ],
      },
      {
        type: 'p',
        text: 'That is three distinct looks out of one purchase, which is a better outcome than three purchases that each work once.',
      },
    ],
    relatedSlugs: ['gold-vs-rose-gold-skin-tone', 'jewellery-gifts-under-1000'],
  },
];

export function getPost(slug: string): JournalPost | undefined {
  return JOURNAL.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string): JournalPost[] {
  const post = getPost(slug);
  if (!post) return [];
  return post.relatedSlugs
    .map((s) => getPost(s))
    .filter((p): p is JournalPost => Boolean(p));
}
