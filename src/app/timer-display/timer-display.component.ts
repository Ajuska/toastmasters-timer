import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-display.component.html',
  styleUrl: './timer-display.component.sass',
})
export class TimerDisplayComponent {
  @Input() seconds: number = 0;
  @Input() flash: boolean = true;
  @Input() displaySeconds: boolean = true;
  @Input() backgroundColor: string = 'rose';
  @Input() colorMapping: { [key: string]: string } = {};

  get shouldFlash(): boolean {
    return this.backgroundColor === 'darkerRed' && this.flash;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  getBoxShadow(): string {
    if (!['darkRed', 'darkerRed'].includes(this.backgroundColor)) {
      return '';
    }

    return `inset 0px 0px 0px 50px var(--color-black)`;
  }
}
