/**
 * Error messages constants
 */
export const ERROR_MESSAGES = {
  invalidFormat: 'Невірний формат посилання',
  addProtocol: 'Додайте http:// або https:// до вашого посилання',
  missingDot: 'Не забудьте крапку',
  extraDot: 'Десь є зайва крапка',
  missingParts: 'Чогось не вистачає',
  emptyUrl: 'Будь ласка, введіть URL',
  qrGenerationError: 'Помилка створення QR коду',
  downloadError: 'Помилка при завантаженні файлу',
  unknownError: 'Незрозуміла помилка',
  success: 'Все чудово'
} as const;

