import { PassportServiceService } from './../../../shared/services/passport-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, MenuController, AlertController, NavController} from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthenticationCodeServiceService } from './../authentication-code-service.service';
import { Signup } from '../signup';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { APP_KEY } from "../../welcome/welcome.page";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  //submited = false;
  //emailOk = true;
  //passwordOk = true;
  //confirmPasswordOk = true;
  //codelock = false;
  //shopNameOk = true;
  private submited: boolean;
  private signup: Signup;
  private shopNameOk = true;
  private slideIndex: number;
  private emailOk = true;
  private passwordOk = true;
  private confirmPasswordOk = true;
  private sms: any;
  constructor( 
    private router: Router,
    private Acs: AuthenticationCodeServiceService, //embarrassed...
    private storage: LocalStorageService,
    private passportService: PassportServiceService,
    private alertController: AlertController,
    private nav: NavController,
    private menuController: MenuController
    ) {
      this.submited = false;
      this.signup ={
        phone: '',
        email: '',
        shopName: '',
        password: '',
        confirmPassword: '',
        code: '',
      };
      this.slideIndex = 0;
      this.sms = {
        content: '获取验证码',
        countdown: 60,
        disable: false,
        maxtry: false,
        trynum : 0,
        code: '',
  };
    }
  @ViewChild('signupSlides', {static: true}) signupSlides: IonSlides;
  
  ngOnInit() {
    this.signupSlides.lockSwipeToNext(true);
  }
  onNext(){
    this.signupSlides.lockSwipeToNext(false);
    this.signupSlides.slideNext();
    this.signupSlides.lockSwipeToNext(true);
  }
  onPrevious(){
    this.signupSlides.slidePrev();
  }
  onSkip(){
    this.router.navigateByUrl('welcome')
  }
  IsSlideChanged(){
    this.signupSlides.getActiveIndex().then(number => {
    this.slideIndex = number;
    });
  }
  canGoBack(){
    this.nav.back();
  }
  checkEmail(event) {
    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (this.signup.email.length < 4 || this.signup.email.length > 30 || !reg.test(this.signup.email)) {
        this.emailOk = false;
    } else {
        this.emailOk = true;
    }
  }
  checkPassword(event) {
    let reg1 = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
    if (this.signup.password.length < 6 || this.signup.password.length > 16 || !reg1.test(this.signup.password)) {
        this.passwordOk = false;
    } else {
        this.passwordOk = true;
      }
  }

  checkConfirmPassword(event) {
    let reg1 = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
    if (this.signup.confirmPassword.length < 6 || this.signup.confirmPassword.length > 16 || !reg1.test(this.signup.password)
        || this.signup.confirmPassword !== this.signup.password) {
        this.confirmPasswordOk = false;
    } else {
        console.log(this.signup.password);
        this.confirmPasswordOk = true;
    }
  }
  checkShopName(event) {
    if (this.signup.shopName.length > 8 || this.signup.shopName.length === 0) {
        this.shopNameOk = false;
    } else {
        this.shopNameOk = true;
       }
  }
  onSubmitPhone(form: NgForm){
    this.submited =true;
    if(form.valid){
      //已通过客户端验证
      this.onNext();
    }
  }
  settime(){
    if(this.sms.countdown == 1){
      this.sms.countdown = 60;
      this.sms.content = '获取验证码';
      this.sms.disable = false;
      return;
    }
    else{
      this.sms.countdown--;
    }
    this.sms.content = '重新获取' + this.sms.countdown +'秒';
    setTimeout(()=> {
      this.sms.content = '重新获取' + this.sms.countdown + '秒';
      this.settime();
    }, 1000);
  }
  async onSendSMS(){
    this.sms.disable = true;
    this.sms.trynum += 1;
    if(this.sms.trynum > 3){
      this.sms.maxtry = true;
      this.sms.content = '达到获取上限';
    }
    else {
      let code = this.Acs.createCode(4);
      console.log(code);
      const alert =  await this.alertController.create({
        header: "验证码",
        message: code,
        buttons: ['确定'],
      });
      alert.present();
      this.settime();
   }
  }
  async onValidateCode(form: NgForm){
    if(form.valid){
      console.log(this.signup.code);
      if(this.Acs.validate(this.signup.code)){
        this.onNext();
      } else {
        const alert = await this.alertController.create({
          header: "提醒",
          message: "验证码错误",
          buttons: ["确定"],
        });
        alert.present();
      }
    }
  }
  async onInputMes(event){
    if(this.shopNameOk && this.emailOk && this.passwordOk && this.confirmPasswordOk){
      let res = this.passportService.addUser(this.signup);
      if(res.success == false){
        let alert = await this.alertController.create({
          header: "提示",
          message: "手机号或邮箱已使用",
          buttons: ["确定"],
        });
        alert.present();
      }else {
        const appConfig: any = this.storage.get(APP_KEY,{
          isLaunched: false,
          isLogin: false,
          version: "1.0.0",
        });
        appConfig.isLogin = true;
        this.storage.set(APP_KEY, appConfig);
        this.onNext();
      }
    }
  }
  GotoLogin(event){
    this.router.navigateByUrl('login');
  }
  ionViewWillEnter(){
    this.menuController.enable(false);
  }
  ionViewDidLeave(){
    this.menuController.enable(true);
  }
}