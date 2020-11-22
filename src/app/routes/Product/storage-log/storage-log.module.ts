import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorageLogPageRoutingModule } from './storage-log-routing.module';

import { StorageLogPage } from './storage-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorageLogPageRoutingModule
  ],
  declarations: [StorageLogPage]
})
export class StorageLogPageModule {}
