import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { ProductServiceService } from './../../../shared/services/product-service.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/class/product';

@Component({
  selector: 'app-modify-product-storage',
  templateUrl: './modify-product-storage.page.html',
  styleUrls: ['./modify-product-storage.page.scss'],
})
export class ModifyProductStoragePage implements OnInit {
  IncreOrDecre: string="IncreaseStorage";
  product: Product;
  num: number;
  inFor = {
    'IncreaseStorage': '入库数量',
    'DecreaseStorage': '出库数量',
  };
  // Logs: [{
  //   time: string,
  //   type: string,
  //   num: number,
  //   status: boolean,
  // }];
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductServiceService,
    private alertController: AlertController,
    private toastController: ToastController,
    private navController: NavController,
    private localStorageService: LocalStorageService,
  ) {
    const barcode = this.activatedRoute.snapshot.params['barcode'];
    this.product = this.productService.getProductByBarcode(barcode);
   }
  ionViewDidLeave(){
    this.num = null;
  }

  async onConfirm() {
    if (this.num <= 0) {
      const alert = await this.alertController.create({
        header: '提示',
        message: '输入值必须大于零',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    if (this.IncreOrDecre == 'IncreaseStorage') {
      this.product.StorageNum += this.num;
    } else {
      if (this.product.StorageNum - this.num < 0) {
        const alert = await this.alertController.create({
          header: '提示',
          message: '出库数量不能大于库存',
          buttons: ['OK']
        });
        await alert.present();
        return ;
      } else {
        this.product.StorageNum -= this.num;
      }
    }
    const res = this.productService.modifyProduct(this.product);
    if (res) {
      console.log('保存成功');
      this.navController.navigateForward(['/product/detail', this.product.barcode]);
      const toast = await this.toastController.create({
        message: '保存成功',
        duration: 2000,
      });
      await toast.present();
    } else {
      console.log('保存失败');
      const alert = await this.alertController.create({
        header: '提示',
        message: '出现未知错误',
        buttons: ['OK']
      });
      await alert.present();
    }
    this.modefyLogUpdate(this.IncreOrDecre, this.num, res);
    console.log('添加至日志');
  }

  async modefyLogUpdate(type: string, num: number, res: boolean) {
    type = type == 'IncreaseStorage' ? '入库数量' : '出库数量';
    // const log = this.localStorageService.get('StorageLog', []);
    // const time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(); // 北京时间
    // const message = time + ':' + type + ':' + num + ':' + '修改成功:' + res;
    // log.unshift(message);
    // this.localStorageService.set('StorageLog', log);
    const Logs = this.localStorageService.get('StorageLog', []);
    const log={
      'time': new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
      'barcode': this.product.barcode,
      'type': type,
      'num': num,
      'status': res,
    };
    // this.log.time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
    // this.log.type = type;
    // this.log.num = num;
    // this.log.status = res;
    // console.log(this.log);
    Logs.unshift(log);
    this.localStorageService.set('StorageLog', Logs);
  }
  ngOnInit() {
  }
  onStorageLog(){
    this.navController.navigateForward(['/storageLog', this.product.barcode]);
  }
}

