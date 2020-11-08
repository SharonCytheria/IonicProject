import { PassportServiceService } from './../../../shared/services/passport-service.service';
import { Router } from '@angular/router';
import { AlertController, IonSlides, NavController, ToastController } from '@ionic/angular';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { AuthenticationCodeServiceService } from './../authentication-code-service.service';
import { Loginaccount } from './../loginaccount';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordPage implements OnInit {
  private account = '';
  private shopNameOk = true;
  private emailOk = true;
  private passwordOk = true;
  private pwd = '';
  private confirmPasswordOk = true;
  private confirmpwd = '';
  private sms: any;
  private loginaccount: Loginaccount;
  constructor(
    private Acs: AuthenticationCodeServiceService,
    private localStorage: LocalStorageService,
    private alertController: AlertController,
    private navController: NavController,
    private toastController: ToastController,
    private router: Router
  ) { 
    this.sms = {
      content: '获取验证码',
      countdown: 60,
      disable: false,
      maxtry: false,
      trynum: 0,
      code: ''
    };
  }
@ViewChild('registerSlides', {static: true}) registerSlides: IonSlides;
  ngOnInit() {
    this.registerSlides.lockSwipeToNext(true);
  }

  canGoBack()
  {
    this.navController.back();
  }

  onNext(){
    this.registerSlides.lockSwipeToNext(false);
    this.registerSlides.slideNext();
    this.registerSlides.lockSwipeToNext(true);
  }

  onPrevious(){
    this.registerSlides.lockSwipeToNext(false);
    this.registerSlides.slideNext();
    this.registerSlides.lockSwipeToNext(true);
  }

  async onAccountCheck(){
    const accounts = this.localStorage.get('LoginA','');
    if(this.account === ''){
      const toast = await this.toastController.create({
        message: '请输入您的邮箱或手机号',
        duration: 3000
      });
      toast.present();
    }
    else{
      let exist = false;
      try{
        accounts.forEach(account => {
          if(((this.account == account.identifier) || this.account == account.email)){
            exist = true;
            throw Error();
          }
        })
      }catch(e){
        const alert = await this.alertController.create({
          header: '提示',
          message: '验证消息已发送，请及时查看',
          buttons: ['知道了']
        });
        alert.present();
      }
      if(exist == false){
        const alert = await this.alertController.create({
          header: '警告',
          message: '该邮箱或手机号未注册',
          buttons: ['知道了']
        });
        alert.present();
      }else{
        this.onNext();
      }
    }
  }
  settime(){
    if(this.sms.countdown == 1){
      this.sms.countdown = 60;
      this.sms.content = '获取验证码';
      this.sms.disable = false;
      return;
    }else {
      this.sms.countdown--;
    }
    this.sms.content = '重新获取'+ this.sms.countdown + '秒';
    setTimeout(()=>{
      this.sms.content = '重新获取' + this.sms.countdown + '秒';
      this.sms.settime();
    }, 1000);
  }

async onSendSMS(){
  this.sms.disable = true;
  this.sms.trunum += 1;
  if(this.sms.trynum > 3){
    this.sms.maxtry = true;
    this.sms.content = '已经达到获取上限';
  }else{
    let code = this.Acs.createCode(4);
    const toast = await this.toastController.create({
      message: '验证码:' + code,
      duration: 3000
    });
    toast.present();
    this.settime();
  }
}
onValidateCode(form: NgForm){
  if(form.valid){
    if(this.Acs.validate(this.sms.code)){ //pass the SMS verification 
      this.onNext();
    }
  }
}
async onInputMes(event){
  if(this.passwordOk && this.confirmPasswordOk){
    let accounts: any = this.localStorage.get('LoginA', null);
    for(var i = 0; i < accounts.length; i++)
    {
      if(this.account == accounts[i].phone || this.account == accounts[i].email){
        accounts[i].PasswordToken = Md5.hashStr(this.pwd).toString();
        this.loginaccount = accounts[i];
        break;
      }
    }//change pwd
    this.localStorage.set('LoginA', accounts); //update pwd
    this.onNext();
  }
}
checkPassword(event){
  let reg1 = /^(?![A-Z]+$)(?![a-z]+$)(?![\W_]+$)\S+$/;
  if(this.pwd.length < 6 || this.pwd.length > 16 || !reg1.test(this.pwd)){
    this.passwordOk = false;
  }else {
    this.passwordOk = true;
  }
}
checkConfirmPassword(event){
  let reg1 = /^(?![A-Z]+$)(?![a-z]+$)(?![\W_]+$)\S+$/;
  if(this.confirmpwd.length < 6 || this.confirmpwd.length > 16 || !reg1.test(this.pwd) || this.confirmpwd !== this.pwd){
    this.confirmPasswordOk = false;
  } else {
    this.confirmPasswordOk = true;
  }
}
}
