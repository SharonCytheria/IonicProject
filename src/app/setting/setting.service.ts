import { LocalStorageService } from './../shared/services/local-storage.service';
import { Injectable } from '@angular/core';
import { APP_KEY } from "../routes/welcome/welcome.page";
export const LAs = "LA";
export const LoginLogs = "LoginLog";
export const Shops = "shop";

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  public User: any;
  public Account: any;
  public Shop: any;
  public APP: any;
  constructor(
    private localStorageService: LocalStorageService
  ) { }
  loading(){
    this.User = this.localStorageService.get(LAs, null);
    this.Account = this.localStorageService.get(LoginLogs, null);
    this.Shop = this.localStorageService.get(Shops, null);
    this.APP = this.localStorageService.get(APP_KEY, null);
  }
}
