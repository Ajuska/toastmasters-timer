import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  timer: number | NodeJS.Timeout | undefined;
  seconds: number = 0;

  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.seconds++;
      }, 1000);
    }
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.seconds = 0;
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
