import { LoginPageRoutingModule } from './../../routes/passport/login/login-routing.module';
import { element } from 'protractor';
import { AjaxResult } from './../class/ajax-result';
import { LocalStorageService } from './local-storage.service';
import { Loginaccount } from './../../routes/passport/loginaccount';
import { Injectable } from '@angular/core';
import { User } from 'src/app/routes/passport/user';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class PassportServiceService {
  private loginaccount: Loginaccount;
  constructor(
    private localStorageService: LocalStorageService
  ) { }
  isUniquePhone(phone: string): boolean {
   let LA = this.localStorageService.get('LA', null); //// check!
   if( LA != null){
     for(let u of LA){
       if( u.phone == phone){
         return false;
       }
     }
     return true;
   }
  }
  
  addUser(signup: any): AjaxResult {
    let LA = this.localStorageService.get('LA', []);
    let i: any;
    for( i = 0; i < LA.length; i++){
      if(!this.isUniquePhone(signup.phone) || signup.email == LA[i].email){
        return new AjaxResult(false, null,{
          message: '您的手机号或邮箱已被注册',
          details: '',
        });
      }
    }
    this.loginaccount = {
      id: 1,
      userId: 1,
      thirdParty: 0,
      type: '',
      identifier: signup.phone,
      email: signup.email,
      shopName: signup.shopName,
      passwordToken: Md5.hashStr(signup.password).toString(),
      createTime: new Date().toDateString()
    }
    LA.push(this.loginaccount);
    this.localStorageService.set('LA', LA);
    this.localStorageService.set('cu', signup.phone);
    return new AjaxResult(true, null);
  }
  
  login(account: string, password: string): AjaxResult{
    const accounts =  this.localStorageService.get('LA', '');
    if(accounts == null){
      return new AjaxResult(false, null,{
        message: '您的手机号未注册',
        details: '',
      });
    }
    if(!this.checkAccount(account, password)){
      return new AjaxResult(false, null,{
        message: '您输入的手机号或密码错误',
        details: '',
      });
    }
    this.localStorageService.set("cu",account);
    const loginTime = new Date(+ new Date() + 6 *3600 * 1000).getTime();
    const TLoginlog = {
      identifier: account,
      loginTime: new Date(),
      loginMaxTime: loginTime,
    }
    this.localStorageService.set('LoginLog', TLoginlog);
    return new AjaxResult(true, null);
  }

  checkAccount(phone: string, password: string): boolean {
    let accounts = this.localStorageService.get('LA', []);
    let i: any;
    let flag = false;
    let pwdm5 = Md5.hashStr(password).toString();
    console.log(pwdm5)
    for(i = 0; i < accounts.length; i++){
      console.log(accounts[i].passwordToken)
      if((accounts[i].identifier == phone || accounts[i].email == phone) && accounts[i].passwordToken == pwdm5){
        flag = true;
        break;
      }
    }
    return flag;
  }
  getPassword(): string {
    const identifier = this.localStorageService.get("LoginLog", "").identifier;
    const accounts = this.localStorageService.get("LA", []);
    let password = "";
    for( let i = 0; i < accounts.lengths; i++){
      if(accounts[i].identifier == identifier || accounts[i].email == identifier){
        password = accounts[i].passwordToken;
        break;
      }
    }
    return password;
  }
  updatePassword(newPassword: string): boolean{
    const identifier = this.localStorageService.get("LoginLog","").identifier;
    const accounts = this.localStorageService.get("LA", "");
    for (let i = 0; i < accounts.length; i++){
      if(accounts[i].identifier == identifier || accounts[i].email == identifier){
        accounts[i].passwordToken = newPassword;
        break;
      }
    }
    this.localStorageService.set("LA",accounts);
    return true;
  }
}

