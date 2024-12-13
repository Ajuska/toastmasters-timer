import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { clearInterval, setInterval } from 'worker-timers';

import { TimerControlsComponent } from './timer-controls/timer-controls.component';
import { TimerDescriptionComponent } from './timer-description/timer-description.component';

import { TimerDisplayComponent } from './timer-display/timer-display.component';
import {
  SpeechTypes,
  Colors,
  ColorMappingType,
  TimeLeftType,
  SpeechPresetsType,
} from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TimerControlsComponent,
    TimerDisplayComponent,
    TimerDescriptionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  timer: number | undefined;
  seconds: number = 0;
  userMinutes: number | undefined = undefined;
  backgroundColor: Colors = 'rose';
  isDisabled: boolean = false;
  displaySeconds: boolean = true;
  selectedPreset: SpeechTypes = '';
  isStartTimerTouched: boolean = false;
  flash: boolean = true;
  wakeLock: WakeLockSentinel | null = null;

  colorMapping: ColorMappingType = {
    green: 'var(--color-green)',
    yellow: 'var(--color-yellow)',
    red: 'var(--color-red)',
    darkRed: 'var(--color-red)',
    darkerRed: 'var(--color-red)',
    rose: 'var(--color-rose)',
  };

  timeLeftSpeech: TimeLeftType = {
    150: 'green',
    90: 'yellow',
    30: 'red',
    15: 'darkRed',
    0: 'darkerRed',
  };

  timeLeftTopics: TimeLeftType = {
    90: 'green',
    60: 'yellow',
    30: 'red',
    15: 'darkRed',
    0: 'darkerRed',
  };

  speechPresets: SpeechPresetsType = {
    icebreaker: 6,
    standard_speech: 7,
    table_topics: 2,
    speech_evaluation: 3,
    general_evaluation: 7,
    gramarian: 3,
    '': undefined,
  };

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
    this.stopWakeLock();
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

  async startWakeLock() {
    if ('wakeLock' in navigator) {
      this.wakeLock = await navigator.wakeLock.request('screen');
    }
  }

  async stopWakeLock() {
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
