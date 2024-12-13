import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../capitalize.pipe';
import { IntegerValidatorDirective } from '../integer-validator.directive';

@Component({
  selector: 'app-timer-controls',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CapitalizePipe,
    IntegerValidatorDirective,
  ],
  templateUrl: './timer-controls.component.html',
  styleUrl: './timer-controls.component.sass',
})
export class TimerControlsComponent {
  @Input() userMinutes: number | null = null;
  @Input() isDisabled: boolean = false;
  @Input() selectedPreset: string = '';
  @Input() speechPresets: { [key: string]: number | null } = {};
  @Input() isStartTimerTouched: boolean = true;
  @Input() timer: number | undefined = undefined;
  @Input() displaySeconds: boolean = true;
  @Output() userMinutesChange = new EventEmitter<number | null>();
  @Output() timeInputChange = new EventEmitter<void>();
  @Output() presetChange = new EventEmitter<Event>();
  @Output() startOrStopAction = new EventEmitter<void>();
  @Output() resetTimer = new EventEmitter<void>();
  @Output() toggleSeconds = new EventEmitter<void>();

  onUserMinutesChange(value: number | null) {
    this.userMinutesChange.emit(value);
    this.timeInputChange.emit();
  }
}
