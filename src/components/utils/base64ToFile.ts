/**
 * Convierte una cadena base64 en un objeto File
 * @param {string} base64 - Cadena base64 (data:image/jpeg;base64,...)
 * @param {string} filename - Nombre del archivo
 * @param {string} mimeType - Tipo MIME (ej. 'image/jpeg')
 * @returns {File}
 */
export function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const arr = base64.split(',');
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mimeType });
}
