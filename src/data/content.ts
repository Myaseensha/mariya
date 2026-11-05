const photo = (file: string) => `${import.meta.env.BASE_URL}photos/${file}`;

export const PHOTOS = {
  sunflower: photo('23dee643-5d45-45e6-a26f-88aad43443b7.jpg'),
  magentaHalo: photo('7578073e-0db0-4cd0-b187-631b669dce64.jpg'),
  carMagenta: photo('9134f68c-0ce1-40af-87b8-9dea447f06fe.jpg'),
  hotPink: photo('5f47242c-1f33-4aab-9825-866a66a18b7c.jpg'),
  brownHearts: photo('f6835292-f6cf-4714-a82c-8b32b44d0bd2.jpg'),
  peaceSign: photo('3d0fddef-fa7f-4c03-accb-fbba1135cd3f.jpg'),
  creamNavy: photo('b5e4b4d6-1593-49b9-905f-13bdbf25b522.jpg'),
  softTeal: photo('3f338826-3e10-4be3-a344-0cb1fd1861ec.jpg'),
} as const;

export type ChapterId =
  | 'opening'
  | 'yellow'
  | 'threshold'
  | 'memories'
  | 'letters'
  | 'secrets'
  | 'finale';

export const CHAPTERS: { id: ChapterId; label: string; whisper: string }[] = [
  { id: 'opening', label: 'The Door', whisper: 'Something is waiting…' },
  { id: 'yellow', label: 'Yellow', whisper: 'My sunflower' },
  { id: 'threshold', label: 'Surprise', whisper: 'Open carefully' },
  { id: 'memories', label: 'Memories', whisper: 'Us, in frames' },
  { id: 'letters', label: 'Letters', whisper: 'Words I keep' },
  { id: 'secrets', label: 'Secrets', whisper: 'Find me' },
  { id: 'finale', label: '21', whisper: 'Happy birthday' },
];

export const MEMORIES = [
  {
    src: PHOTOS.sunflower,
    title: 'My yellow person',
    caption: 'The field that found its center. You, among sunflowers — exactly where you belong.',
    accent: 'sunflower',
  },
  {
    src: PHOTOS.magentaHalo,
    title: 'Soft magic',
    caption: 'That glow around you isn’t a lamp. It’s how the world looks when I’m looking at you.',
    accent: 'magenta',
  },
  {
    src: PHOTOS.hotPink,
    title: 'Joy, loud and pink',
    caption: 'Your smile does that thing — turns ordinary days into something I want to keep forever.',
    accent: 'pink',
  },
  {
    src: PHOTOS.carMagenta,
    title: 'Passenger seat softie',
    caption: 'A quiet ride, a flower in your hijab, and me pretending I wasn’t falling a little more.',
    accent: 'magenta',
  },
  {
    src: PHOTOS.brownHearts,
    title: 'Heart filter, real feelings',
    caption: 'Even the silly filters know the truth. Hearts keep finding their way to you.',
    accent: 'gold',
  },
  {
    src: PHOTOS.peaceSign,
    title: 'Peace & pink crowns',
    caption: 'Playful. Warm. Completely you. This is one of the faces I replay when I miss you.',
    accent: 'mint',
  },
  {
    src: PHOTOS.creamNavy,
    title: 'Cream light',
    caption: 'Elegant without trying. Soft without fading. You make simple moments feel special.',
    accent: 'cream',
  },
  {
    src: PHOTOS.softTeal,
    title: 'Quiet hearts',
    caption: 'A soft look, a soft smile — and somehow that still knocks the air out of me.',
    accent: 'mint',
  },
] as const;

export const LETTERS = [
  {
    id: 'yellow-person',
    title: 'To my yellow person',
    body: `Mariya —

Some people are calm blues and quiet greys. You are sunlight through petals. You are the warmest color in every room I walk into.

I call you my yellow person because loving you feels like standing in that sunflower field — bright, honest, impossible to look away from.

Happy almost-21. I hope this little world I made for you feels even a fraction as golden as you make mine.`,
  },
  {
    id: 'everyday',
    title: 'The everyday magic',
    body: `It isn’t only the big moments.

It’s your laugh in the middle of nothing. It’s the way you look when you’re soft and unguarded. It’s knowing that somewhere, you’re existing — and that alone makes the day better.

Thank you for being the person I want to celebrate every year, loud and quietly, forever.`,
  },
  {
    id: 'promise',
    title: 'A small promise',
    body: `I can’t give you every star, but I can give you this:

I will keep choosing you. In ordinary Tuesdays. In loud birthdays. In the chapters we haven’t written yet.

Twenty-one looks beautiful on you already. I’m so glad I get to watch you become more of yourself.`,
  },
] as const;

export const SECRETS = [
  {
    id: 'petal',
    clue: 'Tap the softest petal',
    reveal: 'I fell for you slowly… and then all at once.',
  },
  {
    id: 'gold',
    clue: 'Find the hidden gold heart',
    reveal: 'You are my favorite notification, my favorite calm, my favorite chaos.',
  },
  {
    id: '21',
    clue: 'Press every candle… almost',
    reveal: '21 wishes, and somehow they all still lead back to you.',
  },
  {
    id: 'name',
    clue: 'Hold the letters of your name',
    reveal: 'Mariya — even your name feels like a soft place to land.',
  },
  {
    id: 'sun',
    clue: 'Wake the tiny sunflower',
    reveal: 'Wherever you stand, that’s where the light gathers for me.',
  },
] as const;

/** Soft lines that appear between chapters — one intentional pause each. */
export const CHAPTER_WHISPERS: Partial<Record<ChapterId, string>> = {
  yellow: 'Before the photos — just this: you already feel like home.',
  memories: 'Keep these frames. I keep looking at them when I miss your laugh.',
  secrets: 'The letters fold away. Something quieter is waiting to be found.',
  finale: 'Almost there — one more soft breath before 21.',
};

export const MEMORY_EASTER = {
  title: 'Pressed flower',
  body: 'You tapped the one I revisit most. If love had a bookmark, it would be this smile.',
};

export const LETTER_PS =
  'P.S. — If you read all three: thank you for letting me love you out loud, even in a website.';

export const FINALE_WISHES = [
  'May your 21st year taste like sunflowers and soft mornings.',
  'May every hard day end with someone who chooses you — starting with me.',
  'May you keep the joy in that pink smile and the peace in that peace sign.',
  'May you never forget: you are deeply, wildly loved.',
];

export const FINALE_CAKE_WISH =
  'Wish locked in: another year of you — and me, lucky enough to witness it.';
