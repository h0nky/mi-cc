import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mi-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() buttonType: string = "primary"
  @Input() text: string = 'Button';
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick = () => {
    this.clicked.emit();
  }
}
