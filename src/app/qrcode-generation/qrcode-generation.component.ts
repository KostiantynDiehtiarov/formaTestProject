import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeInputComponent } from './components/qrcode-input/qrcode-input.component';
import { QrcodeDisplayComponent } from './components/qrcode-display/qrcode-display.component';
import { ERROR_MESSAGES, UI_TEXT } from '../constants';
import { validateUrl, generateQrCodeDataUrl, downloadFileFromDataUrl } from '../utils';

@Component({
  selector: 'app-qrcode-generation',
  standalone: true,
  imports: [CommonModule, QrcodeInputComponent, QrcodeDisplayComponent],
  templateUrl: './qrcode-generation.component.html',
  styleUrl: './qrcode-generation.component.scss'
})

export class QrcodeGenerationComponent {
  protected readonly qrCodeDataUrl = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly UI_TEXT = UI_TEXT;

  async onUrlSubmit(url: string) {
    // Валідація URL
    if (!url.trim()) {
      this.error.set(ERROR_MESSAGES.emptyUrl);
      this.qrCodeDataUrl.set(null);
      return;
    }

    // Використовуємо утиліту валідації
    const validation = validateUrl(url);
    
    if (!validation.isValid) {
      this.error.set(validation.errorType);
      this.qrCodeDataUrl.set(null);
      return;
    }

    try {
      this.isLoading.set(true);
      this.error.set(null);

      // Використовуємо нормалізований URL
      const urlToEncode = validation.normalizedUrl!;

      // Генерація QR-коду через утиліту
      const dataUrl = await generateQrCodeDataUrl(urlToEncode);

      this.qrCodeDataUrl.set(dataUrl);
      this.isLoading.set(false);
    } catch (err) {
      this.isLoading.set(false);
      this.error.set(ERROR_MESSAGES.qrGenerationError);
      this.qrCodeDataUrl.set(null);
    }
  }

  async onDownload() {
    const dataUrl = this.qrCodeDataUrl();
    if (!dataUrl) {
      return;
    }

    try {
      // Використовуємо утиліту для завантаження файлу
      downloadFileFromDataUrl(dataUrl);
    } catch (err) {
      this.error.set(ERROR_MESSAGES.downloadError);
    }
  }
}

