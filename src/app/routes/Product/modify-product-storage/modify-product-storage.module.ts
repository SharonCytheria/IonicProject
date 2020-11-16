import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyProductStoragePageRoutingModule } from './modify-product-storage-routing.module';

import { ModifyProductStoragePage } from './modify-product-storage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyProductStoragePageRoutingModule
  ],
  declarations: [ModifyProductStoragePage]
})
export class ModifyProductStoragePageModule {}
