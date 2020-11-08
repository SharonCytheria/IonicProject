/*
import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export function phoneNumberConfirmValidator(confirm: string): ValidatorFn { 
  return (control: AbstractControl): {[key: string]: any} => { // 传入绑定表单的formControl
    if ( !control.value ) { // 如果绑定未输入值，则返回 required错误
     return {required: true };
    }
    const pattern="^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$";
  　// 如果两次输入的值不相同，则返回confirm的错误
    return !pattern.test(control.value) ? {phone: {value: true}} : null;
   };
}

@Directive({
  selector: '[phoneConfirmValidate]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: phoneNumberValidateDirective,
      multi: true
    }
  ]
})
export class phoneNumberValidateDirective implements Validator {
  @Input('appConfirm') confirm: string;
  constructor() { }
  validate(control: AbstractControl): ValidationErrors {
    return this.confirm ? phoneNumberConfirmValidator(this.confirm)(control) : null;
    // throw new Error('Method not implemented.');
  }
  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method not implemented.');
  // }
}*/