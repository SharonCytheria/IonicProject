import { Router } from '@angular/router';
import { ProductServiceService } from './../../../shared/services/product-service.service';
import { AlertController, NavController, NavParams, ToastController, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
  template: 
  '<div style="display: flex; flex-direction: column;">' +
  '<ion-item (click)="alertProduct()" lines="full"> \n' + '修改商品\n' + '</ion-item> \n' + 
  '<ion-item (click)="DeleteProduct()"> \n' + '删除商品\n' + '</ion-item>'+ '</div>'
})
export class PopoverPage implements OnInit {
  barcode: string;
  constructor(
    private alertController: AlertController,
    private navParams: NavParams,
    private productService: ProductServiceService,
    private toastController: ToastController,
    private navController: NavController,
    private popoverController: PopoverController,
    private router:Router,
  ) {
    this.barcode = this.navParams.data['barcode'];
    console.log(this.barcode);
   }
  async DeleteProduct(){
    const alert = await this.alertController.create({
      header: '删除',
      message: '确定删除该商品信息？',
      buttons: [{
        text: '确定',
        handler: async ()=> {
          const temp = this.productService.deleteProductByBarcode(this.barcode);
          if(temp === true){
            const toast = await this.toastController.create({
              message: '删除成功',
              duration: 2000,
            });
            await toast.present();
            this.navController.navigateForward('/product/list');
          } else {
            const toast = await this.toastController.create({
              message: '删除失败',
              duration: 2000,
            });
            await toast.present();
          }
        }
      },{
        text: '取消',
        handler: () => {
          console.log('cancel');
        }
      }]
    });
    await alert.present();
    this.popoverController.dismiss();
  }
  ngOnInit() {
  }
  alertProduct(){
    console.log('修改商品');
    this.popoverController.dismiss();
  }

}
