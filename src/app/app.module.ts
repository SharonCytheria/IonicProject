import { LocalStorageService } from './shared/services/local-storage.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    StatusBar,
    Camera,
    BarcodeScanner,
    ImagePicker,
    /*
    Type 'BarcodeScannerOriginal' is not assignable to type 'Provider'.
    Type 'BarcodeScannerOriginal' is missing the following properties from type 'FactoryProvider': provide, useFactoryts(2322)
    */
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
