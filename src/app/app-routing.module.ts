import { LoginPageRoutingModule } from './routes/passport/login/login-routing.module';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { StartAppGuard } from './core/start-app.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'folder/id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  
  {//new Format maybe
    path: 'welcome',
    loadChildren: () => import('./routes/welcome/welcome.module').then( m => m.WelcomePageModule),
    canActivate: [StartAppGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./routes/passport/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'passport',
    loadChildren: () => import('./routes/passport/passport.module').then( m => m.PassportModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./routes/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./routes/passport/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'Shop',
    loadChildren: () => import('./setting/shop/shop.module').then(m => m.ShopPageModule)
  },
  {
    path: 'ChangePassword',
    loadChildren: () => import('./setting/change-password/change-password.module').then(m => m.ChangePasswordPageModule)
  },
  {
    path: 'AboutMe',
    loadChildren: () => import('./setting/about-me/about-me.module').then(m => m.AboutMePageModule)
  },
  {
    path: 'ShopEdit',
    loadChildren: () => import('./setting/shop/shop-edit/shop-edit.module').then(m => m.ShopEditPageModule)
  },
  {
    path: 'category-list',
    loadChildren: () => import('./routes/category-list/category-list.module').then( m => m.CategoryListPageModule)
  },
  {
    path: 'category/add',
    loadChildren: () => import('./routes/AboutCategory/category-add/category-add.module').then( m => m.CategoryAddPageModule)
  },
  {
    path: 'category/edit/:id',
    loadChildren: () => import('./routes/AboutCategory/category-edit/category-edit.module').then( m => m.CategoryEditPageModule)
  },
  {
    path: 'category/name/edit',
    loadChildren: () => import('./routes/AboutCategory/category-name-edit/category-name-edit.module').then( m => m.CategoryNameEditPageModule)
  },
  {
    path: 'product/add',
    loadChildren: () => import('./routes/Product/product-add/product-add.module').then( m => m.ProductAddPageModule)
  }
  /*
  {
    path: 'welcome',
    loadChildren: './routes/welcome/welcome.module#WelcomePageModule', 
    canActivate: [StartAppGuard]
  }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
