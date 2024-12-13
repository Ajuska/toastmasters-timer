import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { clearInterval, setInterval } from 'worker-timers';

import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from './capitalize.pipe';
import { IntegerValidatorDirective } from './integer-validator.directive';

type SpeechTypes =
  | 'icebreaker'
  | 'standard_speech'
  | 'table_topics'
  | 'speech_evaluation'
  | 'general_evaluation'
  | 'gramarian'
  | '';

type Colors = 'green' | 'yellow' | 'red' | 'darkRed' | 'darkerRed' | 'rose';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    CapitalizePipe,
    IntegerValidatorDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  timer: number | undefined;
  seconds: number = 0;
  userMinutes: number | null = null;
  backgroundColor: Colors = 'rose';
  isDisabled: boolean = false;
  displaySeconds: boolean = true;
  selectedPreset: SpeechTypes = '';
  isStartTimerTouched: boolean = false;
  flash: boolean = true;
  wakeLock: any = null;

  colorMapping: { [key in Colors]: string } = {
    green: 'var(--color-green)',
    yellow: 'var(--color-yellow)',
    red: 'var(--color-red)',
    darkRed: 'var(--color-red)',
    darkerRed: 'var(--color-red)',
    rose: 'var(--color-rose)',
  };

  timeLeftSpeech: { [key: number]: Colors } = {
    150: 'green',
    90: 'yellow',
    30: 'red',
    15: 'darkRed',
    0: 'darkerRed',
  };

  timeLeftTopics: { [key: number]: Colors } = {
    90: 'green',
    60: 'yellow',
    30: 'red',
    15: 'darkRed',
    0: 'darkerRed',
  };

  speechPresets: { [key in SpeechTypes]: number | null } = {
    icebreaker: 6,
    standard_speech: 7,
    table_topics: 2,
    speech_evaluation: 3,
    general_evaluation: 7,
    gramarian: 3,
    '': null,
  };

  get shouldFlash(): boolean {
    return this.backgroundColor === 'darkerRed' && this.flash;
  }

  startTimer() {
    this.isStartTimerTouched = true;
    if (!this.userMinutes || !Number.isInteger(this.userMinutes)) {
      return;
    }

    if (!this.timer) {
      this.isDisabled = true;
      this.flash = true;
      this.timer = setInterval(() => {
        this.seconds++;
        this.updateBackgroundColor();
      }, 1000);
      this.startWakeLock();
    }
  }

  stopTimer() {
    if (!this.userMinutes || !Number.isInteger(this.userMinutes)) {
      return;
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.isDisabled = false;
      this.timer = undefined;
      this.flash = false;
      this.stopWakeLock();
    }
  }

  startOrStopAction(): void {
    if (this.timer) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  resetTimer() {
    this.stopTimer();
    this.seconds = 0;
    this.backgroundColor = 'rose';
    this.flash = true;
  }

  updateBackgroundColor() {
    if (!this.userMinutes || !Number.isInteger(this.userMinutes)) {
      return;
    }

    // add 30s to keep the number positive in 'time left' rules
    const totalSeconds = this.userMinutes * 60 + 30;
    const remainingSeconds = totalSeconds - this.seconds;

    if (this.userMinutes <= 0) {
      this.stopTimer();
      this.seconds = 0;
      this.backgroundColor = 'rose';
      return;
    }

    const timeLeft =
      this.selectedPreset === 'table_topics'
        ? this.timeLeftTopics
        : this.timeLeftSpeech;

    if (remainingSeconds > Math.max(...Object.keys(timeLeft).map(Number))) {
      this.backgroundColor = 'rose';
      return;
    }

    for (const [time, color] of Object.entries(timeLeft)) {
      if (remainingSeconds <= +time && this.seconds > 0) {
        this.backgroundColor = color;
        break;
      }
    }
  }

  toggleSeconds() {
    this.displaySeconds = !this.displaySeconds;
  }

  onPresetChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPreset = target.value as SpeechTypes;
    this.userMinutes = this.speechPresets[this.selectedPreset];
    this.resetTimer();
  }

  onTimeInputChange(): void {
    this.selectedPreset = '';
    this.resetTimer();
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

  async startWakeLock() {
    if ('wakeLock' in navigator) {
      this.wakeLock = await navigator.wakeLock.request('screen');
    }
  }

  stopWakeLock() {
    if (this.wakeLock !== null) {
      this.wakeLock.release().then(() => {
        this.wakeLock = null;
      });
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      this.startOrStopAction();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.resetTimer();
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
