import QRCode from 'qrcode';
import { QR_CODE_CONFIG } from '../constants';

/**
 * QR Code generation options
 */
export interface QrCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
}

/**
 * Generates a QR code as a Data URL
 * @param url - The URL to encode in the QR code
 * @param options - Optional QR code generation options (uses default config if not provided)
 * @returns Promise that resolves to a Data URL string
 * @throws Error if QR code generation fails
 */
export async function generateQrCodeDataUrl(
  url: string,
  options?: QrCodeOptions
): Promise<string> {
  const qrOptions = {
    width: options?.width ?? QR_CODE_CONFIG.width,
    margin: options?.margin ?? QR_CODE_CONFIG.margin,
    color: options?.color ?? QR_CODE_CONFIG.colors
  };

  return QRCode.toDataURL(url, qrOptions);
}

