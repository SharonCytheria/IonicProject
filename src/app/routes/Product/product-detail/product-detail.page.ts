import { PassportServiceService } from './../../../shared/services/passport-service.service';
import { ProductServiceService } from './../../../shared/services/product-service.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from 'src/app/shared/class/product';
import { PopoverController, AlertController, ToastController, NavController, ActionSheetController } from '@ionic/angular';
import { PopoverPage } from '../popover/popover.page';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  product: Product;
  CheckPrice: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductServiceService,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private toastController: ToastController,
    private navController: NavController,
    private actionSheetController: ActionSheetController,
    private passportService: PassportServiceService,
  ) { 
    this.ionViewDidEnter();
  }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    const barcode = this.activatedRoute.snapshot.params['barcode'];
    this.product = this.productService.getProductByBarcode(barcode);
    this.CheckPrice = false;
  }
  ionViewDidLeave(){
    this.CheckPrice = false;
  }
  async checkUser(){
    const alert = await this.alertController.create({
      header: '请登录',
      inputs: [{
        name: 'account',
        type: 'text',
        placeholder: '请输入账户',
      },{
        name: 'password',
        type: 'password',
        placeholder: '请输入密码'
      }],
      buttons: [{
        text: '确定',
        handler: async (data) => {
          console.log('确定');
          const temp = this.passportService.checkAccount(data.account, data.password);
          if(temp === true){
            console.log('验证成功');
            this.CheckPrice = true;
          } else {
            console.log('验证失败');
            const toast = await this.toastController.create({
              message: '账号或密码错误',
              duration: 3000
            });
            await toast.present();
          }
        }
      },{
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('cancel');
        }
      }]
    });
    await alert.present();
  }
  //Buttons can have the property of 'role' which can either be 'destructive' or 'cancel'
  async onPresentActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: '分享',
      cssClass: 'SC-Action-Sheet',
      buttons: [{
        text: '好友',
        icon: 'people-outline',
        handler: () => {
          console.log('WeChat');
        }
      },{
        text: 'Instagram',
        icon: 'logo-instagram',
        handler: () => {
          console.log('Moments');
        }
      },{
        text: '短信',
        icon: 'mail-outline',
        handler: () => {
          console.log('text');
        }
      },{
        text: 'QQ',
        icon: 'logo-tux',
        handler: () => {
          console.log('QQ');
        }
      },{
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('cancel');
        }
      }]
    });
    await actionSheet.present();
  }
  //下拉框
  async onPresentPopover(event){
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: event,
      componentProps: {'barcode': this.product.barcode},
      translucent: false,
      backdropDismiss: true
    });
    await popover.present();
  }
  ModifyProductStorage(){
    this.navController.navigateForward(['/ModifyProductStorage', this.product.barcode]);
    console.log(this.product.barcode);
  }
}
