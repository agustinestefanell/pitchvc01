# AISYNC Online Pitch Deck

Este repositorio contiene un visor web del pitch deck basado en slides exportadas desde el PDF fuente.

## Qué hay en este repo

- `public/index.html` — visor web del pitch deck.
- `public/styles.css` — estilos sobrios y responsive.
- `public/script.js` — navegación, deep linking, teclado y estado de slide.
- `public/data/pitchDeck.js` — fuente única de verdad con slides y secciones.
- `scripts/export-pitch-slides.js` — exporta las páginas del PDF a PNG.
- `public/assets/pitch-v5/` — destino previsto para las imágenes exportadas.

## PDF fuente

Coloca el PDF del pitch en la raíz del repositorio con uno de estos nombres preferidos:

- `PITCH DECK v5-4 - Control layer for AI-assisted work..pptx.pdf`
- `pitch-source.pdf`
- `pitch.pdf`
- `PITCH DECK*.pdf`

También puedes ejecutar el script pasándole la ruta al PDF:

```bash
npm run export:pitch -- "./PITCH DECK v5-4 - Control layer for AI-assisted work..pptx.pdf"
```

## Cómo exportar las slides

```bash
npm run export:pitch
```

Esto genera las imágenes en:

- `public/assets/pitch-v5/slide-01.png`
- ...
- `public/assets/pitch-v5/slide-17.png`

## Cómo correr local

Para revisar el visor localmente, abre `public/index.html` en el navegador o sirve el directorio `public` con cualquier servidor estático.

## Build

No hay compilación de frontend necesaria; el sitio es estático. Para comprobar el repo con npm:

```bash
npm run build
```

## Ruta final del visor

- `public/index.html`
- ruta pública esperada: `/` cuando se despliega como sitio estático.
