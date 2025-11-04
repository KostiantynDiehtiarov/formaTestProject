import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected url = '';
  protected readonly qrCodeDataUrl = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);

  private isValidTld(tld: string): boolean {
    // TLD має бути від 2 до 63 символів
    if (tld.length < 2 || tld.length > 63) {
      return false;
    }

    // TLD може містити лише літери (a-z), цифри (0-9) та дефіси
    // Але не може починатися або закінчуватися дефісом
    const tldPattern = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
    if (!tldPattern.test(tld)) {
      return false;
    }

    // Список поширених та валідних TLD (включаючи нові gTLD та ccTLD)
    const validTlds = [
      // Загальні TLD
      'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
      // Регіональні TLD
      'ua', 'uk', 'us', 'de', 'fr', 'it', 'es', 'pl', 'ru', 'by', 'kz',
      'ca', 'au', 'jp', 'cn', 'in', 'br', 'mx', 'ar', 'co', 'za',
      // Нові gTLD
      'io', 'ai', 'co', 'tv', 'me', 'dev', 'app', 'tech', 'online', 'site',
      'store', 'shop', 'blog', 'info', 'biz', 'xyz', 'pro', 'name', 'mobi',
      // Інші поширені
      'eu', 'asia', 'travel', 'jobs', 'museum', 'tel', 'xxx', 'aero'
    ];

    // Перевірка на наявність у списку поширених TLD
    if (validTlds.includes(tld.toLowerCase())) {
      return true;
    }

    // Додаткова перевірка: якщо TLD відповідає формату (2-63 символи, лише літери/цифри/дефіси),
    // дозволяємо його (для нових TLD, які можуть з'явитися)
    return tldPattern.test(tld);
  }

  private validateUrl(url: string): { isValid: boolean; normalizedUrl?: string } {
    const trimmedUrl = url.trim();

    // Перевірка на порожній рядок
    if (!trimmedUrl) {
      return { isValid: false };
    }

    // Перевірка мінімальної довжини
    if (trimmedUrl.length < 3) {
      return { isValid: false };
    }

    // Додаємо протокол, якщо його немає
    let urlToValidate = trimmedUrl;
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      urlToValidate = 'https://' + trimmedUrl;
    }

    try {
      // Використовуємо вбудований URL конструктор для валідації
      const urlObj = new URL(urlToValidate);

      // Перевірка наявності хоста (домену)
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return { isValid: false };
      }

      // Перевірка що hostname містить хоча б одну крапку (для доменів)
      if (!urlObj.hostname.includes('.')) {
        return { isValid: false };
      }

      // Перевірка на заборонені символи в hostname
      if (urlObj.hostname.includes('..') || urlObj.hostname.startsWith('.') || urlObj.hostname.endsWith('.')) {
        return { isValid: false };
      }

      // Перевірка доменної зони (TLD)
      const hostnameParts = urlObj.hostname.split('.');
      if (hostnameParts.length < 2) {
        return { isValid: false };
      }

      // Отримуємо TLD (остання частина після останньої крапки)
      const tld = hostnameParts[hostnameParts.length - 1];
      
      // Перевірка валідності TLD
      if (!this.isValidTld(tld)) {
        return { isValid: false };
      }

      // Перевірка на локальні адреси (якщо потрібно заборонити)
      const localPatterns = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
      if (localPatterns.some(pattern => urlObj.hostname.includes(pattern))) {
        // Можна дозволити localhost, але для демо залишаємо перевірку
      }

      return { isValid: true, normalizedUrl: urlObj.toString() };
    } catch (err) {
      // Якщо URL конструктор викинув помилку, посилання невалідне
      return { isValid: false };
    }
  }

  async generateQR() {
    const urlValue = this.url.trim();
    
    // Валідація URL
    if (!urlValue) {
      this.error.set('Будь ласка, введіть URL');
      this.qrCodeDataUrl.set(null);
      return;
    }

    // Використовуємо метод валідації
    const validation = this.validateUrl(urlValue);
    
    if (!validation.isValid) {
      this.error.set('Перевірте Ваше посилання');
      this.qrCodeDataUrl.set(null);
      return;
    }

    try {
      this.isLoading.set(true);
      this.error.set(null);

      // Використовуємо нормалізований URL
      const urlToEncode = validation.normalizedUrl!;

      // Генерація QR-коду
      const dataUrl = await QRCode.toDataURL(urlToEncode, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      this.qrCodeDataUrl.set(dataUrl);
      this.isLoading.set(false);
    } catch (err) {
      this.isLoading.set(false);
      this.error.set('Перевірте Ваше посилання');
      this.qrCodeDataUrl.set(null);
    }
  }

  async downloadQR() {
    const dataUrl = this.qrCodeDataUrl();
    if (!dataUrl) {
      return;
    }

    try {
      // Створюємо посилання для завантаження
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      this.error.set('Помилка при завантаженні файлу');
    }
  }
}
