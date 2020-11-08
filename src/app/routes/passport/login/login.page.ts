import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { PassportServiceService } from './../../../shared/services/passport-service.service';
import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { APP_KEY } from '../../welcome/welcome.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private passportService: PassportServiceService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private menuController: MenuController
  ) { }
  shop: any;
  username: string = ''; //视图模型的属性账号，双向绑定
  password: string = ''; //视图模型的属性密码，双向绑定
  ngOnInit() {}

  //点击登录按钮时调用
  async onLogin(form: NgForm){
    let toast: any;
    console.log(this.username, this.password);
    toast = await this.toastController.create({
      duration: 3000,
      message: "",
    });
    if(this.username === ''){
      toast.message = '请输入您的手机号或邮箱';
      toast.present();//符合触发条件后立即执行显示。
    }else if(!this.check()){
      toast.message = '手机号或邮箱格式错误';
      toast.present();
    }else if (this.password === ''){
      toast.message = '请输入密码';
      toast.present();//符合触发条件后立即执行显示。
    }else {
      let res = this.passportService.login(this.username, this.password);
      if(!res.success){
        const alert = await this.alertController.create({
          header: '提示',
          message: res.error.message,
          buttons: ['确定'],
        });
        alert.present();//符合触发条件后立即执行显示。
      }else {
        let appConfig: any = this.localStorageService.get(APP_KEY,{
          inLaunched: false,
          isLogin: false,
          version: '1.0.0'
        });
        appConfig.isLogin = true;
        this.localStorageService.set(APP_KEY, appConfig);
        this.getShopLog();
        this.router.navigateByUrl('/home');
      }
    }
  }
  check()
  {
    let regemail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    let regphone = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
    if(this.username.length > 4 && this.username.length < 30){
      if(regemail.test(this.username) || regphone.test(this.username))
        return true;
      else return false;
    } else{
      return false;
    }
  }
  getShopLog(){
    this.shop = this.localStorageService.get("shop", {
      shopName: "",
      shortName: "",
      phone: "",
      email: "",
      shopKeeperName: "",
      shopTel: "",
      createTime: new Date(),
    });
    const accounts = this.localStorageService.get("LA", ""); // ??!check!
    for( var i = 0; i < accounts.length; i++){
      if( accounts[i].identifier == this.username || accounts[i].email == this.username){
        this.shop.shopName = accounts[i].shopName;
        this.shop.phone = accounts[i].identifier;
        this.shop.email = accounts[i].email;
        break;
      }
    }
    this.localStorageService.set("shop", this.shop);
  }
  ionViewWillEnter(){
    this.menuController.enable(false);
  }
  ionViewDidLeave(){
    this.menuController.enable(true);
  }
}
