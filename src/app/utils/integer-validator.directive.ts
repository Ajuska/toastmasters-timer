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

    if (value === null || value === undefined || value === '') {
      return { message: 'Please enter a valid number.' };
    }

    if (typeof value === 'string') {
      const trimmedValue = value.trim();

      if (trimmedValue.endsWith('.') || trimmedValue.endsWith(',')) {
        return { message: 'Trailing dots are not allowed.' };
      }

      if (isNaN(Number(trimmedValue))) {
        return { message: 'Please enter a valid number.' };
      }

      if (parseFloat(trimmedValue) <= 0) {
        return { message: 'Please enter a number greater than 0.' };
      }
    }

    return null;
  }
}
