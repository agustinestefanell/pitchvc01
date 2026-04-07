const fs = require("fs");
const path = require("path");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const { NodeCanvasFactory } = require("pdfjs-dist/lib/display/node_utils.js");

const defaultPdfName = "PITCH DECK v5-4 - Control layer for AI-assisted work..pptx.pdf";
const inputPath = process.argv[2] || path.join(__dirname, "..", defaultPdfName);
const outputDir = path.join(__dirname, "..", "public", "assets", "pitch-v5");

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function padSlideNumber(num) {
  return String(num).padStart(2, "0");
}

async function exportSlides() {
  if (!fs.existsSync(inputPath)) {
    console.error(`ERROR: PDF fuente no encontrado en ${inputPath}`);
    console.error("Coloca el PDF en la raíz del repo o pásalo como argumento al script.");
    process.exit(1);
  }

  ensureDirectory(outputDir);
  const pdfData = new Uint8Array(fs.readFileSync(inputPath));
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdfDocument = await loadingTask.promise;

  const pageCount = pdfDocument.numPages;
  console.log(`PDF abierto correctamente: ${pageCount} página(s)`);
  if (pageCount !== 17) {
    console.warn(`Advertencia: se esperaban 17 páginas, pero el PDF tiene ${pageCount}. El script exportará todas las páginas disponibles.`);
  }

  const canvasFactory = new NodeCanvasFactory();

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const targetWidth = 1920;
    const scale = targetWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });
    const canvasAndContext = canvasFactory.create(scaledViewport.width, scaledViewport.height);

    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport: scaledViewport,
      canvasFactory,
    };

    await page.render(renderContext).promise;

    const outputFilePath = path.join(outputDir, `slide-${padSlideNumber(pageNumber)}.png`);
    const buffer = canvasAndContext.canvas.toBuffer("image/png");
    fs.writeFileSync(outputFilePath, buffer);
    console.log(`Exportado ${outputFilePath}`);
  }

  console.log(`Exportación completa en ${outputDir}`);
}

exportSlides().catch((error) => {
  console.error("ERROR: Falló la exportación de slides.");
  console.error(error);
  process.exit(1);
});
