# OpenSource PDF Tools

An all-in-one PDF toolkit that runs entirely in the browser. No server, no uploads - your files never leave your device.

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-teal) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

| Tool | Description |
|------|-------------|
| **Compress PDF** | Reduce PDF file size by re-serializing |
| **Merge PDF** | Combine multiple PDF files into one |
| **Split PDF** | Extract selected pages with visual thumbnails |
| **PDF to JPG** | Convert PDF pages to JPEG images |
| **JPG to PDF** | Convert JPG/PNG images into a PDF document |
| **PDF to Word** | Extract text content from a PDF |
| **Word to PDF** | Convert DOCX documents to PDF |
| **Edit PDF** | Add text annotations on PDF pages |
| **Sign PDF** | Draw a signature and place it on a PDF |
| **Protect PDF** | Add password protection to a PDF |
| **Unlock PDF** | Remove password from a protected PDF |
| **Rotate PDF** | Rotate individual pages with live preview |

## Tech Stack

- **React 18** - UI components
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first styling
- **pdf-lib** - PDF manipulation (merge, split, rotate, edit, sign, compress)
- **pdfjs-dist** - PDF rendering and text extraction
- **mammoth** - DOCX to text conversion
- **react-dropzone** - Drag-and-drop file upload
- **lucide-react** - Icons
- **file-saver / jszip** - File downloads and zip bundling

## Getting Started

### Option 1: Docker (Recommended)

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed

#### Using Docker Compose

```bash
git clone https://github.com/skmahe1077/opensource-pdf-tools
cd opensource-pdf-tools
docker compose up -d
```

Open [http://localhost:9090](http://localhost:9090) in your browser.

To stop:

```bash
docker compose down
```

#### Using Docker directly

```bash
git clone https://github.com/skmahe1077/opensource-pdf-tools
cd opensource-pdf-tools
docker build -t opensource-pdf-tools .
docker run -d -p 9090:80 --name opensource-pdf-tools opensource-pdf-tools
```

Open [http://localhost:9090](http://localhost:9090) in your browser.

To stop:

```bash
docker stop opensource-pdf-tools && docker rm opensource-pdf-tools
```

---

### Option 2: Node.js

#### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

#### Installation

```bash
git clone https://github.com/skmahe1077/opensource-pdf-tools
cd opensource-pdf-tools
npm install
```

#### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Production Build

```bash
npm run build
npm run preview
```

The built files will be in the `dist/` directory, ready for static hosting.

## Project Structure

```
pdftool/
├── index.html                 # HTML entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Router and route definitions
    ├── index.css              # Tailwind directives
    ├── config/
    │   └── tools.js           # Tool metadata (name, route, color, icon)
    ├── components/
    │   ├── Layout.jsx         # Header + Footer wrapper
    │   ├── Header.jsx         # Top navigation bar
    │   ├── Footer.jsx         # Footer with privacy note
    │   ├── ToolCard.jsx       # Colored card on homepage
    │   ├── FileUploader.jsx   # Drag-and-drop file upload
    │   ├── ProgressBar.jsx    # Progress indicator
    │   ├── DownloadButton.jsx # File download trigger
    │   ├── PdfPreview.jsx     # Single PDF page renderer
    │   ├── PdfPageList.jsx    # Thumbnail grid of all pages
    │   └── SignatureCanvas.jsx# Freehand signature drawing pad
    ├── pages/
    │   ├── Home.jsx           # Homepage with tool grid
    │   ├── CompressPdf.jsx
    │   ├── MergePdf.jsx
    │   ├── SplitPdf.jsx
    │   ├── PdfToJpg.jsx
    │   ├── JpgToPdf.jsx
    │   ├── PdfToWord.jsx
    │   ├── WordToPdf.jsx
    │   ├── EditPdf.jsx
    │   ├── SignPdf.jsx
    │   ├── ProtectPdf.jsx
    │   ├── UnlockPdf.jsx
    │   └── RotatePdf.jsx
    ├── hooks/
    │   └── usePdfRenderer.js  # PDF loading and page rendering hook
    └── utils/
        ├── pdfWorkerSetup.js  # pdfjs-dist worker configuration
        ├── download.js        # File save and zip helpers
        ├── merge.js
        ├── split.js
        ├── rotate.js
        ├── compress.js
        ├── pdfToJpg.js
        ├── jpgToPdf.js
        ├── pdfToWord.js
        ├── wordToPdf.js
        ├── editPdf.js
        ├── signPdf.js
        ├── protect.js
        └── unlock.js
```

## Privacy

All PDF processing is performed **100% client-side** using JavaScript. Your files are never uploaded to any server. Everything runs locally in your browser.

## Known Limitations

- **Compress PDF:**  Uses PDF re-serialization which strips unused objects. For heavy image-based compression, professional tools may yield better results.
- **Word to PDF:**  Extracts plain text from DOCX; complex formatting (tables, images, styles) is not preserved.
- **Protect PDF:**  Client-side encryption has limitations. For sensitive documents, use dedicated PDF software.
- **PDF to Word:**  Extracts text into a `.docx` file; complex layouts and images are not preserved.

## Author

Developed by **Mahendran Selvakumar** — [GitHub](https://github.com/skmahe1077/)

## License

MIT
