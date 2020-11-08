import { ActivatedRoute } from '@angular/router';
import { AppPage } from './../../e2e/src/app.po';
import { LocalStorageService } from './shared/services/local-storage.service';
import { Component, NgZone, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages: Array<{title: string, url: string, icon: string}>
  private shopName = '何炅快乐店';
  private phone = '18860117382';
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  private shopinfo: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private localstorage: LocalStorageService,
    private menuController: MenuController,
    private statusBar: StatusBar,
    private activatedRoute: ActivatedRoute,
    private zone: NgZone
  ) {
    this.initializeApp();
    this.appPages = [
      {
        title: '开店论坛',
        url: '/home',
        icon: 'chatbox'
      },
      {
        title: '手机橱窗',
        url: '/home',
        icon: 'create'
      },
      {
        title: '邀请有礼',
        url: '/home',
        icon: 'git-merge'
      },
      {
        title: '资金账户',
        url: '/home',
        icon: 'cash'
      },
      {
        title: '反馈建议',
        url: '/home',
        icon: 'cash'
      },
      {
        title: '帮助中心',
        url: '/home',
        icon: 'cash'
      }
    ];
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      setInterval(() => {
        this.Initiate();
      }, 500);
      
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex( (page) => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  Initiate(){
    let shop = this.localstorage.get("shop", {});
    this.shopName = shop.shopName;
    this.phone = shop.phone;
  }
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewDidLeave() {
    this.menuController.enable(true);
  }
  dataInit(event){
    this.shopinfo = this.localstorage.get("shop",{});

  }
}
