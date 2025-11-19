import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KEYBOARD_KEYS, UI_TEXT } from '../../../constants';
import { ButtonComponent, InputComponent } from '../../../shared/components';

@Component({
  selector: 'app-qrcode-input',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './qrcode-input.component.html',
  styleUrl: './qrcode-input.component.scss'
})
export class QrcodeInputComponent {
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;
  @Output() urlSubmit = new EventEmitter<string>();

  protected url = '';
  protected readonly UI_TEXT = UI_TEXT;
  protected readonly KEYBOARD_KEYS = KEYBOARD_KEYS;

  onGenerate() {
    this.urlSubmit.emit(this.url);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEYS.Enter) {
      this.onGenerate();
    }
  }

  onButtonClick() {
    this.onGenerate();
  }
}

