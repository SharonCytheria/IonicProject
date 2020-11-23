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
  private password = '';
  private confirmPasswordOk = true;
  private confirmpwd = '';
  private message: any;
  private loginaccount: Loginaccount;
  constructor(
    private AuthenticationCodeService: AuthenticationCodeServiceService,
    private localStorageService: LocalStorageService,
    private alertController: AlertController,
    private navController: NavController,
    private toastController: ToastController,
    private router: Router
  ) { 
    this.message = {
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
  onAccountCheck(){}
/*
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
            //throw Error();
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
  *//*
  async onAccountCheck(){
    const accounts = this.localStorage.get('LoginA', '');
    if(this.account === ''){
      const toast = await this.toastController.create({
        message: '请输入您的邮箱或手机号',
        duration: 3000,
      });
    } else {
      let exist = false;
      accounts.forEach(async account => {
        if(this.account == account.identifier || this.account == account.email){
          exist = true;
          const alert = await this.alertController.create({
            header: '提示',
            message: '验证消息已发送，请及时查看',
            buttons: ['知道了']
          });
          alert.present();
          this.onNext();
        }
        if(exist == false){
          const alert = await this.alertController.create({
            header: '警告',
            message: '该邮箱或手机号未注册',
            buttons: ['知道了']
          });
          alert.present();
        }
        
      });
    }
  }*/
  settime(){
    if(this.message.countdown == 1){
      this.message.countdown = 60;
      this.message.content = '获取验证码';
      this.message.disable = false;
      return;
    }else {
      this.message.countdown--;
    }
    this.message.content = '重新获取'+ this.message.countdown + '秒';
    setTimeout(()=>{
      this.message.content = '重新获取' + this.message.countdown + '秒';
      this.message.settime();
    }, 1000);
  }

async onSendSMS(){
  this.message.disable = true;
  this.message.trunum += 1;
  if(this.message.trynum > 3){
    this.message.maxtry = true;
    this.message.content = '已经达到获取上限';
  }else{
    let code = this.AuthenticationCodeService.createCode(4);
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
    if(this.AuthenticationCodeService.validate(this.message.code)){ //pass the SMS verification 
      this.onNext();
    }
  }
}
async onInputMes(event){
  if(this.passwordOk && this.confirmPasswordOk){ // password double check 
    let accounts: any = this.localStorageService.get('LoginA', null); // to get an array of accounts from storage 
    for(var i = 0; i < accounts.length; i++) // for every account in accounts
    {
      if(this.account == accounts[i].phone || this.account == accounts[i].email){ // if account exists
        accounts[i].PasswordToken = Md5.hashStr(this.password).toString();
        this.loginaccount = accounts[i];
        break;
      }
    }//change pwd
    this.localStorageService.set('LoginA', accounts); //update pwd
    this.onNext();
  }
}
checkPassword(event){
  let Instruct = /^(?![A-Z]+$)(?![a-z]+$)(?![\W_]+$)\S+$/;
  if(this.password.length < 6 || this.password.length > 16 || !Instruct.test(this.password)){
    this.passwordOk = false;
  }else {
    this.passwordOk = true;
  }
}
checkConfirmPassword(event){
  let Instruct = /^(?![A-Z]+$)(?![a-z]+$)(?![\W_]+$)\S+$/;
  if(this.confirmpwd.length < 6 || this.confirmpwd.length > 16 || !Instruct.test(this.password) || this.confirmpwd !== this.password){
    this.confirmPasswordOk = false;
  } else {
    this.confirmPasswordOk = true;
  }
}
}
