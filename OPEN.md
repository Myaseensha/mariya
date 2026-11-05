# How to open Mariya’s birthday site

## Fastest — production build (no install)

```bash
cd ~/Documents/mariya-birthday-site
npx --yes serve dist -p 4173
```

Open http://localhost:4173

## Dev mode

```bash
cd ~/Documents/mariya-birthday-site
npm install
npm run dev
```

## Soft surprises to try

- Touch the sunflower portal on the opening door
- Tap the sunflower-field photo (Chapter II)
- Triple-tap the first memory (“My yellow person”) for a pressed-flower note
- Open all three love letters for a hidden P.S.
- Secrets is a treasure hunt: tap the petal, find the faint gold heart, wake the sleeping sunflower, press & hold MARIYA, blow out 4 candles. A sunflower petal lights per find; "Need a hint?" glows the next one; all 5 = confetti + fanfare
- Finale: tap the cake · tap the portrait to flip photos
- Double-tap empty space anywhere for a heart bloom
- Between some chapters, a soft whisper pause appears (tap to continue)
- The site opens on a gold "Tap to open your surprise" screen — that tap starts Happy Birthday (browsers block sound before a tap; if autoplay is allowed the song starts on its own and this screen is skipped). ♫ bottom-right mutes it

Edit copy in `src/data/content.ts`.
