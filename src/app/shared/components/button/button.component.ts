import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'success' | 'download' | 'default';

/**
 * Button component with multiple variants and states
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled && !this.isLoading) {
      this.clicked.emit();
    }
  }

  protected get buttonClasses(): string {
    const classes = ['btn'];
    
    switch (this.variant) {
      case 'primary':
        classes.push('btn-primary');
        break;
      case 'success':
      case 'download':
        classes.push('btn-download');
        break;
      default:
        // Default button styling already in .btn class
        break;
    }

    if (this.fullWidth) {
      classes.push('btn-full-width');
    }

    return classes.join(' ');
  }
}

