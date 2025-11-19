import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '../constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorType: string;
  normalizedUrl?: string;
}

/**
 * Validates if a TLD (Top Level Domain) is valid
 * @param tld - The TLD to validate
 * @returns true if the TLD is valid, false otherwise
 */
export function isValidTld(tld: string): boolean {
  // TLD має бути від 2 до 63 символів
  if (tld.length < VALIDATION_CONSTANTS.tld.minLength || tld.length > VALIDATION_CONSTANTS.tld.maxLength) {
    return false;
  }

  // TLD може містити лише літери (a-z), цифри (0-9) та дефіси
  // Але не може починатися або закінчуватися дефісом
  if (!VALIDATION_CONSTANTS.tld.pattern.test(tld)) {
    return false;
  }

  // Перевірка на наявність у списку поширених TLD
  if ((VALIDATION_CONSTANTS.validTlds as readonly string[]).includes(tld.toLowerCase())) {
    return true;
  }

  // Додаткова перевірка: якщо TLD відповідає формату (2-63 символи, лише літери/цифри/дефіси),
  // дозволяємо його (для нових TLD, які можуть з'явитися)
  return VALIDATION_CONSTANTS.tld.pattern.test(tld);
}

/**
 * Validates a URL string and returns validation result
 * @param url - The URL string to validate
 * @returns ValidationResult object with isValid flag, errorType, and normalizedUrl if valid
 */
export function validateUrl(url: string): ValidationResult {
  const trimmedUrl = url.trim();

  // Перевірка на порожній рядок
  if (!trimmedUrl) {
    return { isValid: false, errorType: ERROR_MESSAGES.invalidFormat };
  }

  // Перевірка мінімальної довжини
  if (trimmedUrl.length < VALIDATION_CONSTANTS.url.minLength) {
    return { isValid: false, errorType: ERROR_MESSAGES.invalidFormat };
  }

  // Додаємо протокол, якщо його немає
  let urlToValidate = trimmedUrl;
  if (!trimmedUrl.startsWith(VALIDATION_CONSTANTS.protocols.http) && !trimmedUrl.startsWith(VALIDATION_CONSTANTS.protocols.https)) {
    return { isValid: false, errorType: ERROR_MESSAGES.addProtocol };
  }

  try {
    // Використовуємо вбудований URL конструктор для валідації
    const urlObj = new URL(urlToValidate);

    // Перевірка наявності хоста (домену)
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return { isValid: false, errorType: ERROR_MESSAGES.invalidFormat };
    }

    // Перевірка що hostname містить хоча б одну крапку (для доменів)
    if (!urlObj.hostname.includes('.')) {
      return { isValid: false, errorType: ERROR_MESSAGES.missingDot };
    }

    // Перевірка на заборонені символи в hostname
    if (urlObj.hostname.includes('..') || urlObj.hostname.startsWith('.') || urlObj.hostname.endsWith('.')) {
      return { isValid: false, errorType: ERROR_MESSAGES.extraDot };
    }

    // Перевірка доменної зони (TLD)
    const hostnameParts = urlObj.hostname.split('.');
    if (hostnameParts.length < 2) {
      return { isValid: false, errorType: ERROR_MESSAGES.missingParts };
    }

    // Отримуємо TLD (остання частина після останньої крапки)
    const tld = hostnameParts[hostnameParts.length - 1];
    
    // Перевірка валідності TLD
    if (!isValidTld(tld)) {
      return { isValid: false, errorType: ERROR_MESSAGES.invalidFormat };
    }

    // Перевірка на локальні адреси (якщо потрібно заборонити)
    if (VALIDATION_CONSTANTS.localPatterns.some(pattern => urlObj.hostname.includes(pattern))) {
      // Можна дозволити localhost, але для демо залишаємо перевірку
    }

    return { isValid: true, errorType: ERROR_MESSAGES.success, normalizedUrl: urlObj.toString() };
  } catch (err) {
    // Якщо URL конструктор викинув помилку, посилання невалідне
    return { isValid: false, errorType: ERROR_MESSAGES.unknownError };
  }
}

