import { AlertController } from '@ionic/angular';
import { LocalStorageService } from './../shared/services/local-storage.service';
import { SettingService } from './setting.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  version: "";
  constructor(
    private settingService: SettingService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.settingService.loading();
    this.version = this.settingService.APP.versoin;
  }
  onLogout(){
    this.localStorageService.remove("LoginLog");
    // this.localStorageService.remove("LA");
    // this.localStorageService.remove("shop");
    this.router.navigateByUrl("login");

  }
  async checkUpdate(){
    let alert = await this.alertController.create({
      header: "提示",
      message: "当前为最新版本",
      buttons: ["确定"],
    });
    alert.present();
  }
  onCall(){
    window.location.href = "tel:18860117384"; // check!!!!
  }
  onBack(){
    this.router.navigateByUrl("home");
  }
}
