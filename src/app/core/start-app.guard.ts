import { APP_KEY } from './../routes/welcome/welcome.page';
import { LocalStorageService } from './../shared/services/local-storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
/*
export class StartAppGuard implements CanActivate {
  constructor(private LocalStorageService: LocalStorageService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
*/
export class StartAppGuard implements CanActivate {
  constructor(private localStorageService: LocalStorageService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let appConfig: any = this.localStorageService.get(APP_KEY, {
      isLogin: false,
      isLaunched: false,
      version: '0.1.9'
    });
    if (appConfig.isLaunched === false) {
      appConfig.isLaunched = true;
      this.localStorageService.set(APP_KEY, appConfig);
      return true;
    } else {
      try {
        if (this.localStorageService.get("LoginLog", "") === null) {
          this.router.navigateByUrl("/login");
          return true;
        }
        const lastloginTime: any = this.localStorageService.get("LoginLog", "").loginMaxTime;
        const loginTime = new Date().getTime();
        if (loginTime > lastloginTime) {
          appConfig = {
            isLaunched: true,
            isLogin: false,
            version: "0.1.9",
          };
          this.localStorageService.set(APP_KEY, appConfig);
        }
        if (appConfig.isLogin == true) {
          this.router.navigateByUrl("/home");
        } else {
          this.router.navigateByUrl("/login");
        }
        return false;
      }
      catch (e) {
        return false;
      }
    }
  }
}