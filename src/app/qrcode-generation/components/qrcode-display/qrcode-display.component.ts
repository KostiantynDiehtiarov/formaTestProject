import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UI_TEXT, UI_CONFIG } from '../../../constants';
import { ButtonComponent } from '../../../shared/components';

@Component({
  selector: 'app-qrcode-display',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './qrcode-display.component.html',
  styleUrl: './qrcode-display.component.scss'
})
export class QrcodeDisplayComponent {
  @Input() qrCodeDataUrl!: string;
  @Output() download = new EventEmitter<void>();

  protected readonly UI_TEXT = UI_TEXT;
  protected readonly UI_CONFIG = UI_CONFIG;

  onDownload() {
    this.download.emit();
  }
}

