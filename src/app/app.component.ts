import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from './capitalize.pipe';

type SpeechTypes =
  | 'icebreaker'
  | 'standard'
  | 'table_topics'
  | 'evaluation'
  | '';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, CapitalizePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  timer: number | NodeJS.Timeout | undefined;
  seconds: number = 0;
  userMinutes: number | null = null;
  backgroundColor: string = 'white';
  isDisabled: boolean = false;
  displaySeconds: boolean = true;
  selectedPreset: SpeechTypes = '';

  timeLeftSpeech = {
    150: 'green',
    90: 'yellow',
    30: 'red',
    15: 'red', // add exlamation point? + buzz
    0: 'red', // flash red? + 2 buzzes
  };

  timeLeftTopics = {
    90: 'green',
    60: 'yellow',
    30: 'red',
    15: 'red',
    0: 'red',
  };

  colorSignifigance = {
    green: 'green',
    yellow: 'yellow',
    red: 'red',
  };

  speechPresets: { [key in SpeechTypes]: number | null } = {
    icebreaker: 6,
    standard: 7,
    table_topics: 2,
    evaluation: 3,
    '': null,
  };

  startTimer() {
    if (!this.userMinutes) {
      return;
    }

    if (!this.timer) {
      this.isDisabled = true;
      this.timer = setInterval(() => {
        this.seconds++;
        this.updateBackgroundColor();
      }, 1000);
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
    }
  }

  resetTimer() {
    this.stopTimer();
    this.seconds = 0;
    this.backgroundColor = 'white';
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
      this.backgroundColor = 'white';
      return;
    }

    const timeLeft =
      this.selectedPreset === 'table_topics'
        ? this.timeLeftTopics
        : this.timeLeftSpeech;

    if (remainingSeconds > Math.max(...Object.keys(timeLeft).map(Number))) {
      this.backgroundColor = 'white';
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

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.timer) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.resetTimer();
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
