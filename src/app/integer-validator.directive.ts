import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector: '[appIntegerValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: IntegerValidatorDirective,
      multi: true,
    },
  ],
})
export class IntegerValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined) {
      return { message: 'Enter a valid number.' };
    } else if (value === 0) {
      return { message: 'Please enter a number greater than 0.' };
    } else if (value < 0) {
      return { message: 'Please enter a positive number.' };
    } else if (!Number.isInteger(value)) {
      return { message: 'Please enter a round number.' };
    }
    return null;
  }
}
