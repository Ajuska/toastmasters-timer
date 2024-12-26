import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-description.component.html',
  styleUrl: './timer-description.component.sass',
})
export class TimerDescriptionComponent implements OnInit {
  isDescriptionHidden: boolean = false;

  ngOnInit() {
    this.updateDescriptionVisibility();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateDescriptionVisibility();
  }

  updateDescriptionVisibility() {
    this.isDescriptionHidden = window.innerWidth <= 768;
  }

  toggleDescription() {
    if (window.innerWidth <= 768) {
      this.isDescriptionHidden = !this.isDescriptionHidden;
    }
  }
}
