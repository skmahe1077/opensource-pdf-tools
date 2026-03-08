import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CompressPdf from './pages/CompressPdf';
import MergePdf from './pages/MergePdf';
import SplitPdf from './pages/SplitPdf';
import PdfToJpg from './pages/PdfToJpg';
import JpgToPdf from './pages/JpgToPdf';
import PdfToWord from './pages/PdfToWord';
import WordToPdf from './pages/WordToPdf';
import EditPdf from './pages/EditPdf';
import SignPdf from './pages/SignPdf';
import ProtectPdf from './pages/ProtectPdf';
import UnlockPdf from './pages/UnlockPdf';
import RotatePdf from './pages/RotatePdf';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/compress-pdf" element={<CompressPdf />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/split-pdf" element={<SplitPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/word-to-pdf" element={<WordToPdf />} />
          <Route path="/edit-pdf" element={<EditPdf />} />
          <Route path="/sign-pdf" element={<SignPdf />} />
          <Route path="/protect-pdf" element={<ProtectPdf />} />
          <Route path="/unlock-pdf" element={<UnlockPdf />} />
          <Route path="/rotate-pdf" element={<RotatePdf />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
