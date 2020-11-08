import { SharedModule } from './../../shared/shared.module';
import { SignupPage } from './signup/signup.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PassportRoutingModule } from './passport-routing.module';


@NgModule({
  declarations: [
    SignupPage
  ],
  imports: [
    CommonModule,
    SharedModule,
    PassportRoutingModule
  ]
})
export class PassportModule { }
