import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-description.component.html',
  styleUrl: './timer-description.component.sass',
})
export class TimerDescriptionComponent {
  @Input() isDescriptionHidden: boolean = true;
  @Input() isMobile: boolean = false;
}
