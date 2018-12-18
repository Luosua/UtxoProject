import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';


export function forbiddenValueValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    // const forbidden = Number(+control.value) == +control.value;
    // console.log(Number(+control.value) == +control.value);
    const forbidden = false;
    return forbidden ? {'forbiddenValue': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appForbiddenValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}]
})
export class ForbiddenValidatorDirective implements Validator {
  validate(control: AbstractControl): {[key: string]: any} | null {
    return forbiddenValueValidator()(control);
  }
}


