import { Component } from '@angular/core';
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
  userMinutes: number = 2;
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

  colorSignifigance = {
    green: 'green',
    yellow: 'yellow',
    red: 'red',
  };

  speechPresets: { [key in SpeechTypes]: number | undefined } = {
    icebreaker: 6,
    standard: 7,
    table_topics: 2,
    evaluation: 3,
    '': undefined,
  };

  startTimer() {
    if (!this.timer) {
      this.isDisabled = true;
      this.timer = setInterval(() => {
        this.seconds++;
        this.updateBackgroundColor();
      }, 1000);
    }
  }

  stopTimer() {
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
    const totalSeconds = this.userMinutes * 60;
    const remainingSeconds = totalSeconds - this.seconds;

    if (this.userMinutes <= 0) {
      this.stopTimer();
      this.seconds = 0;
      this.backgroundColor = 'white';
      return;
    }

    if (
      remainingSeconds >
      Math.max(...Object.keys(this.timeLeftSpeech).map(Number))
    ) {
      this.backgroundColor = 'white';
      return;
    }

    for (const [time, color] of Object.entries(this.timeLeftSpeech)) {
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
    this.userMinutes = this.speechPresets[this.selectedPreset] ?? 0;
    this.resetTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
