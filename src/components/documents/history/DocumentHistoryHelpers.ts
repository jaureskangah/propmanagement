
// Helper functions for document handling

export function downloadDocument(fileUrl: string, fileName: string) {
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function viewDocument(fileUrl: string) {
  window.open(fileUrl, '_blank');
}
