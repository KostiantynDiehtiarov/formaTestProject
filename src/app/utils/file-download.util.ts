import { QR_CODE_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Downloads a file from a Data URL
 * @param dataUrl - The Data URL of the file to download
 * @param filename - Optional filename (defaults to QR_CODE_CONFIG.downloadFilename)
 * @returns void, but throws error if download fails
 * @throws Error with message from ERROR_MESSAGES.downloadError if download fails
 */
export function downloadFileFromDataUrl(dataUrl: string, filename?: string): void {
  try {
    // Створюємо посилання для завантаження
    const link = document.createElement('a');
    link.download = filename ?? QR_CODE_CONFIG.downloadFilename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    throw new Error(ERROR_MESSAGES.downloadError);
  }
}

