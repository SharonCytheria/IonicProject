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
  private submited: boolean;
  private signup: Signup;
  private shopNameOk = true;
  private slideIndex: number;
  private emailOk = true;
  private passwordOk = true;
  private confirmPasswordOk = true;
  private message: any;
  constructor( 
    private router: Router,
    private authenticationCodeService: AuthenticationCodeServiceService, //embarrassed...
    private localStorageService: LocalStorageService, //used to get or set storage
    private passportService: PassportServiceService,
    private alertController: AlertController, 
    private navController: NavController, 
    private menuController: MenuController
    ) {
      this.submited = false;
      this.signup ={  //initiate
        phone: '',
        email: '',
        shopName: '',
        password: '',
        confirmPassword: '',
        code: '',
      };
      this.slideIndex = 0;
      this.message = {
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
    this.navController.back();
  }
  checkEmail(event) {
    let instruct = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      // 正则表达式 
      // 邮箱地址 必须由大小写字母或数字或下划线开头，
      // 其后可以
      // 跟上任意的 \w字符 和 中划线 加号 英文句号
      // 跟上任意的 \w字符 和 中划线 加号 英文句号
      // 跟上任意的 \w字符 和 中划线 加号 英文句号
    if (this.signup.email.length < 4 || this.signup.email.length > 30 || !instruct.test(this.signup.email)) {
        this.emailOk = false;
    } else {
        this.emailOk = true;
    }
  }
  checkPassword(event) {
    let instruct = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
    //正则表达式 
    if (this.signup.password.length < 6 || this.signup.password.length > 16 || !instruct.test(this.signup.password)) {
        this.passwordOk = false;
    } else {
        this.passwordOk = true;
      }
  }

  checkConfirmPassword(event) {
    let instruct = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
    //正则表达式
    if (this.signup.confirmPassword.length < 6 || this.signup.confirmPassword.length > 16 || !instruct.test(this.signup.password)
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
    if(this.message.countdown == 1){
      this.message.countdown = 60;
      this.message.content = '获取验证码';
      this.message.disable = false;
      return;
    }
    else{
      this.message.countdown--;
    }
    this.message.content = '重新获取' + this.message.countdown +'秒';
    setTimeout(()=> {
      this.message.content = '重新获取' + this.message.countdown + '秒';
      this.settime();
    }, 1000);
  }
  async onSendSMS(){
    this.message.disable = true;
    this.message.trynum += 1;
    if(this.message.trynum > 3){
      this.message.maxtry = true;
      this.message.content = '达到获取上限';
    }
    else {
      let code = this.authenticationCodeService.createCode(4);
      console.log(code);
      // An Alert is a dialog that presents users with information or collects information from the user using inputs.
      // An alert appears on top of the app's content, 
      // and must be manually dismissed by the user before they can resume interaction with the app.
      // It can also optionally have a header, subHeader and message.
      const alert =  await this.alertController.create({
        header: "验证码",
        message: code,
        buttons: ['确定'],
      });
      // In the array of buttons, each button includes properties for its text, and optionally a handler. 
      // If a handler returns false then the alert will not automatically be dismissed when the button is clicked. 
      // All buttons will show up in the order they have been added to the buttons array from left to right. 
      alert.present();
      this.settime();
   }
  }
  async onValidateCode(form: NgForm){
    if(form.valid){
      //console.log(this.signup.code);
      if(this.authenticationCodeService.validate(this.signup.code)){
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
      let temp = this.passportService.addUser(this.signup);
      if(temp.success == false){
        let alert = await this.alertController.create({
          header: "提示",
          message: "手机号或邮箱已使用",
          buttons: ["确定"],
        });
        alert.present();
      }else {
        const appConfig: any = this.localStorageService.get(APP_KEY,{
          isLaunched: false,
          isLogin: false,
          version: "1.0.0",
        });
        appConfig.isLogin = true;
        this.localStorageService.set(APP_KEY, appConfig);
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