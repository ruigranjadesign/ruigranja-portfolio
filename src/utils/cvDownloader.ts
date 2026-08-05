/**
 * Utility to reliably download the Rui Granja CV PDF across all browsers,
 * iframe environments (such as AI Studio preview), and mobile devices.
 */
export async function downloadCv(filename: string = 'Rui_Granja_CV.pdf'): Promise<void> {
  const pdfUrl = '/Rui_Granja_CV.pdf';

  try {
    const response = await fetch(pdfUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = blobUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      if (document.body.contains(anchor)) {
        document.body.removeChild(anchor);
      }
      window.URL.revokeObjectURL(blobUrl);
    }, 200);
  } catch (err) {
    console.warn('Blob fetch download failed, falling back to direct anchor download:', err);
    
    // Direct fallback without target="_blank"
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = pdfUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      if (document.body.contains(anchor)) {
        document.body.removeChild(anchor);
      }
    }, 200);
  }
}
