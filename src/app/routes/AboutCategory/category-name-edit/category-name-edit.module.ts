import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryNameEditPageRoutingModule } from './category-name-edit-routing.module';

import { CategoryNameEditPage } from './category-name-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CategoryNameEditPageRoutingModule
  ],
  declarations: [CategoryNameEditPage]
})
export class CategoryNameEditPageModule {}
