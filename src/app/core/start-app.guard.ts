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
    const appConfig: any = this.localStorageService.get(APP_KEY, {
      isLogin: false,
      isLaunched: false,
      version: '1.0.0'
    });
    if( appConfig.isLaunched === false ) {
      appConfig.isLaunched = true;
      this.localStorageService.set(APP_KEY, appConfig);
      return true;
    } else {
      const lastloginTime: any = this.localStorageService.get("LoginLog", "").loginMaxTime;
      const loginTime = new Date().getTime();
      if(loginTime > lastloginTime) {
        this.localStorageService.set(APP_KEY, {
          isLaunched: true,
          isLogin: false,
          version: "1.0.0",
        });
      }
      if (appConfig.isLogin == true) this.router.navigateByUrl("home");
      else this.router.navigateByUrl("login")
      return false;
    }
  }
}