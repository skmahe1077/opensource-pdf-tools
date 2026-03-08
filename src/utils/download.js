import { saveAs } from 'file-saver';

export function downloadBlob(blob, filename) {
  saveAs(blob, filename);
}

export async function downloadAsZip(items, zipName) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  items.forEach(({ blob, name }) => zip.file(name, blob));
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipName);
}
