import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyProductStoragePage } from './modify-product-storage.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyProductStoragePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyProductStoragePageRoutingModule {}
