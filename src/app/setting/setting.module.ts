import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { SettingPageRoutingModule } from './setting-routing.module';
import { SettingPage } from './setting.page';

@NgModule({
  imports: [
    SharedModule,
    SettingPageRoutingModule
  ],
  declarations: [SettingPage]
})
export class SettingPageModule {}
