import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorageLogPage } from './storage-log.page';

const routes: Routes = [
  {
    path: '',
    component: StorageLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageLogPageRoutingModule {}
