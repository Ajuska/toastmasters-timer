import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { clearInterval, setInterval } from 'worker-timers';
import { BREAKPOINT_MEDIUM } from '../constants';

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
  selectedPreset: SpeechTypes = '--- Select Preset ---';
  isStartTimerTouched: boolean = false;
  flash: boolean = true;
  wakeLock: WakeLockSentinel | null = null;
  isDescriptionHidden: boolean = true;
  isMobile: boolean = false;

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
    invocation: 2,
    introduction: 1,
    greeter: 2,
    speech_icebreaker: 6,
    speech_standard: 7,
    speech_longer: 15,
    table_topics: 2,
    evaluator_written: 1,
    evaluator_speech: 3,
    evaluator_general: 7,
    evaluator_TT: 6,
    grammarian: 2,
    toastmaster: 3,
    timer: 1,
    '--- Select Preset ---': undefined,
  };

  startTimer() {
    this.isStartTimerTouched = true;
    if (!this.userMinutes) {
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
    if (!this.userMinutes) {
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
    if (!this.userMinutes) {
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
    this.selectedPreset = '--- Select Preset ---';
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

  updateDescriptionVisibility() {
    if (typeof navigator !== 'undefined' && typeof window !== 'undefined') {
      this.isMobile = /android|ipad|iphone/i.test(navigator.userAgent);
      this.isDescriptionHidden = window.innerWidth <= BREAKPOINT_MEDIUM;
    }
  }

  toggleDescription() {
    if (window.innerWidth <= BREAKPOINT_MEDIUM) {
      this.isDescriptionHidden = !this.isDescriptionHidden;
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateDescriptionVisibility();
  }

  ngOnInit() {
    this.updateDescriptionVisibility();
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
