import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-shop-edit',
  templateUrl: './shop-edit.page.html',
  styleUrls: ['./shop-edit.page.scss'],
})
export class ShopEditPage implements OnInit {
  title: string;
  property: string;
  value: any;
  shop: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private toastController: ToastController,
    private router: Router
  ) {
    activatedRoute.queryParams.subscribe((queryParams) =>{ // to get Parameters from url
      this.property = queryParams.property;
      this.title = queryParams.title;
    });
   }

  ngOnInit() {
  }
  async onSave(){
    this.shop = this.localStorageService.get("shop", "");
    this.shop[this.property] = this.value;
    this.localStorageService.set("shop", this.shop);
    this.value = "";
    const toast = await this.toastController.create({
      message: "保存成功",
      duration: 3000,
    });
    toast.present();
    this.router.navigateByUrl("/Shop", { skipLocationChange: false});
  }
}
