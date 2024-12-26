import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Colors, ColorMappingType } from '../types';
import { BREAKPOINT_MEDIUM } from '../../constants';

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
  @Input() backgroundColor: Colors = 'rose';
  @Input() colorMapping: ColorMappingType = {};

  get shouldFlash(): boolean {
    return this.backgroundColor === 'darkerRed' && this.flash;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  getBoxShadow(): string {
    const borderWidth = window.innerWidth <= BREAKPOINT_MEDIUM ? 35 : 50;
    if (!['darkRed', 'darkerRed'].includes(this.backgroundColor)) {
      return '';
    }

    return `inset 0px 0px 0px ${borderWidth}px var(--color-black)`;
  }

  getAriaLabel(): string {
    const resultsMap: { [key in Colors]: string } = {
      rose: 'good',
      green: 'good',
      yellow: 'warning',
      red: "time's up",
      darkRed: 'almost disqualified',
      darkerRed: 'disqualified',
    };
    return `Speech status: ${resultsMap[this.backgroundColor]}`;
  }
}
