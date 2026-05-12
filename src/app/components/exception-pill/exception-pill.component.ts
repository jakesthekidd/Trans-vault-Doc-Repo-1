import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ExceptionPillVariant = 'exception' | 'hold';

@Component({
  selector: 'app-exception-pill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exception-pill.component.html',
  styleUrls: ['./exception-pill.component.scss'],
})
export class ExceptionPillComponent {
  /** Visual variant: field exception (orange) or document hold (gray). */
  @Input() variant: ExceptionPillVariant = 'exception';
  /** Label text shown in the pill. */
  @Input() label = '';
}
