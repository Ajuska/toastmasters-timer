import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../utils/capitalize.pipe';
import { IntegerValidatorDirective } from '../utils/integer-validator.directive';

import { SpeechTypes, SpeechPresetsType } from '../types';
@Component({
  selector: 'app-timer-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CapitalizePipe,
    IntegerValidatorDirective,
  ],
  templateUrl: './timer-controls.component.html',
  styleUrl: './timer-controls.component.sass',
})
export class TimerControlsComponent {
  @Input() userMinutes: number | undefined = undefined;
  @Input() isDisabled: boolean = false;
  @Input() selectedPreset: SpeechTypes = '--- Select Preset ---';
  @Input() speechPresets: SpeechPresetsType = {};
  @Input() isStartTimerTouched: boolean = true;
  @Input() timer: number | undefined = undefined;
  @Input() displaySeconds: boolean = true;
  @Output() userMinutesChange = new EventEmitter<number | undefined>();
  @Output() timeInputChange = new EventEmitter<void>();
  @Output() presetChange = new EventEmitter<Event>();
  @Output() startOrStopAction = new EventEmitter<void>();
  @Output() resetTimer = new EventEmitter<void>();
  @Output() toggleSeconds = new EventEmitter<void>();

  onUserMinutesChange(value: number | undefined) {
    this.userMinutesChange.emit(value);
    this.timeInputChange.emit();
  }
}
