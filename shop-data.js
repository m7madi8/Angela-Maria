/**
 * The Art of Stillness — product catalog
 * Product photography lives in images/mini-store/
 * Set published: false to hide drafts. layout: 'feature' = wider card on desktop.
 */

window.ANGILA_SHOP = {
  categories: [
    {
      id: 'dreamcatchers',
      label: 'Dreamcatchers',
      intro: 'Hoops and feathers, made slowly.'
    },
    {
      id: 'macrame',
      label: 'Macramé & Wall Hangings',
      intro: 'Knotwork for a calm wall.'
    },
    {
      id: 'decor',
      label: 'Handmade Art & Decor',
      intro: 'Small objects for a quiet room.'
    },
    {
      id: 'gifts',
      label: 'Thoughtful Gifts',
      intro: 'Pieces chosen to be given.'
    }
  ],

  products: [
    {
      slug: 'turquoise-sage-dreamcatcher',
      category: 'dreamcatchers',
      name: 'Turquoise & sage dreamcatcher',
      shortDescription: 'A quiet hoop for a still corner.',
      points: ['Turquoise and sage', 'Soft mint feathers', 'Made once, by hand'],
      materials: 'Yarn, cord, beads, feathers',
      dimensions: 'About 50 × 24 cm',
      care: 'Indoors. Away from sun.',
      price: null,
      available: true,
      featured: true,
      published: true,
      layout: 'feature',
      images: ['images/mini-store/01.JPG'],
      imageFocus: 'center 48%'
    },
    {
      slug: 'teal-tiered-dreamcatcher',
      category: 'dreamcatchers',
      name: 'Teal tiered dreamcatcher',
      shortDescription: 'Three hoops, falling like a breath.',
      points: ['Teal and white', 'Soft white feathers', 'For a doorway or a quiet wall'],
      materials: 'Hoops, yarn, cord, feathers',
      dimensions: 'About 75 × 18 cm',
      care: 'Indoors. Keep dry.',
      price: null,
      available: true,
      featured: true,
      published: true,
      layout: 'standard',
      images: ['images/mini-store/02.JPG'],
      imageFocus: 'center 42%'
    },
    {
      slug: 'sage-tiered-dreamcatcher',
      category: 'dreamcatchers',
      name: 'Sage tiered dreamcatcher',
      shortDescription: 'Layered green. A room that exhales.',
      points: ['Muted sage hoops', 'Deep teal feathers', 'Texture to rest your eyes on'],
      materials: 'Hoops, yarn, beads, feathers',
      dimensions: 'About 80 × 20 cm',
      care: 'Indoors. Away from sun.',
      price: null,
      available: true,
      featured: true,
      published: true,
      layout: 'feature',
      images: ['images/mini-store/03.JPG'],
      imageFocus: 'center 48%'
    },
    {
      slug: 'earth-feather-dreamcatcher',
      category: 'dreamcatchers',
      name: 'Earth-tone feather dreamcatcher',
      shortDescription: 'Warm, grounded, close to the earth.',
      points: ['Brown and forest feathers', 'A classic woven hoop', 'For a shelf or a hook'],
      materials: 'Hoop, yarn, cord, feathers',
      dimensions: 'About 45 × 22 cm',
      care: 'Indoors. Keep dry.',
      price: null,
      available: true,
      featured: false,
      published: true,
      layout: 'standard',
      images: ['images/mini-store/04.JPG'],
      imageFocus: 'center 58%'
    },
    {
      slug: 'lavender-amethyst-dreamcatcher',
      category: 'dreamcatchers',
      name: 'Lavender & amethyst dreamcatcher',
      shortDescription: 'Lavender, a small stone, a little hush.',
      points: ['Soft lavender cord', 'A raw amethyst centre', 'Made to be looked at'],
      materials: 'Hoop, cord, yarn, amethyst',
      dimensions: 'About 35 × 18 cm',
      care: 'Handle the stone gently.',
      price: null,
      available: true,
      featured: false,
      published: true,
      layout: 'standard',
      images: ['images/mini-store/05.JPG'],
      imageFocus: 'center 45%'
    },
    {
      slug: 'plum-fringe-wall-hanging',
      category: 'macrame',
      name: 'Plum fringe wall hanging',
      shortDescription: 'Deep plum. A wall that feels held.',
      points: ['Woven web', 'Chevron fringe', 'For a calm alcove'],
      materials: 'Hoop, cord, yarn',
      dimensions: 'About 55 × 28 cm',
      care: 'Indoors. Brush the fringe lightly.',
      price: null,
      available: true,
      featured: false,
      published: true,
      layout: 'feature',
      images: ['images/mini-store/06.JPG'],
      imageFocus: 'center 40%'
    },
    {
      slug: 'forest-multi-hoop-dreamcatcher',
      category: 'dreamcatchers',
      name: 'Forest multi-hoop dreamcatcher',
      shortDescription: 'Colour that moves, then settles.',
      points: ['One hoop, three below', 'Teal, lavender, warm brown', 'Feathers that shift in the light'],
      materials: 'Hoops, yarn, beads, feathers',
      dimensions: 'About 65 × 26 cm',
      care: 'Indoors. Away from sun.',
      price: null,
      available: true,
      featured: false,
      published: true,
      layout: 'standard',
      images: ['images/mini-store/07.JPG'],
      imageFocus: 'center 50%'
    },
    {
      slug: 'teal-beaded-dreamcatcher',
      category: 'dreamcatchers',
      name: 'Teal beaded dreamcatcher',
      shortDescription: 'Playful colour, still handmade.',
      points: ['Teal hoops', 'Wooden beads', 'Mixed feathers'],
      materials: 'Hoops, yarn, beads, feathers',
      dimensions: 'About 70 × 22 cm',
      care: 'Indoors. Fluff the feathers.',
      price: null,
      available: true,
      featured: false,
      published: true,
      layout: 'standard',
      images: ['images/mini-store/08.JPG'],
      imageFocus: 'center 46%'
    },
    {
      slug: 'plum-beaded-dreamcatcher',
      category: 'dreamcatchers',
      name: 'Plum beaded dreamcatcher',
      shortDescription: 'Dark plum, blush, a little violet.',
      points: ['One hoop and three small ones', 'Terracotta beads', 'Violet and soft pink feathers'],
      materials: 'Hoops, yarn, beads, feathers',
      dimensions: 'About 68 × 24 cm',
      care: 'Indoors. Away from sun.',
      price: null,
      available: true,
      featured: false,
      published: true,
      layout: 'standard',
      images: ['images/mini-store/09.JPG'],
      imageFocus: 'center 48%'
    },
    {
      slug: 'tree-of-life-wire-hanging',
      category: 'decor',
      name: 'Tree of life wire hanging',
      shortDescription: 'A tree in a circle. Ask what’s here now.',
      points: ['Wire and a metal hoop', 'Stone or glass leaves', 'Colours vary — message me'],
      materials: 'Hoop, wire, beads',
      dimensions: 'Ask for the piece in hand',
      care: 'Indoors. Dust gently.',
      price: null,
      available: true,
      featured: false,
      published: true,
      layout: 'standard',
      images: ['images/mini-store/10.JPG'],
      imageFocus: 'center 35%'
    },
    {
      slug: 'artisan-stand-collection',
      category: 'gifts',
      name: 'Artisan stand collection',
      shortDescription: 'A small mix, chosen for giving.',
      points: ['Dreamcatchers and wire trees', 'Market-day pieces', 'Ask what’s free to ship'],
      materials: 'Varies by piece',
      dimensions: 'Ask for a specific item',
      care: 'Told with each piece',
      price: null,
      available: true,
      featured: false,
      published: true,
      layout: 'feature',
      images: ['images/mini-store/11.JPG'],
      imageFocus: 'center 40%'
    }
  ]
};
