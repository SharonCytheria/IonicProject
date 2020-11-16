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
  inOrOut: string;
  product: Product;
  num: number;
  inFor = {
    'IncreaseStorage': '入库数量',
    'DecreaseStorage': '出库数量',
  };
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
  /**
   * 点击确定，进行数量验证，若不符返回友好信息
   * @returns {Promise<void>}
   */
  async onClick() {
    if (this.num <= 0) {
      const alert = await this.alertController.create({
        header: '提示',
        message: '输入值必须大于零',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    if (this.inOrOut == 'putInInventory') {
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
      this.navController.navigateForward(['/productDetails', this.product.barcode]);
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
    this.modefyLogUpdate(this.inOrOut, this.num, res);
    console.log('添加至日志');
  }

  /**
   * 查看出入库记录
   */
  seeLog() {
    this.navController.navigateForward('/log');
  }
  /**
   * 修改日志
   * @param {string} statu
   * @param {number} num
   */
  async modefyLogUpdate(statu: string, num: number, res: boolean) {
    statu = statu == 'IncreaseStorage' ? '入库数量' : '出库数量';
    const log = this.localStorageService.get('modefyLog', []);
    const time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(); // 北京时间
    const message = time + ':' + statu + ':' + num + ':' + '修改成功:' + res;
    log.unshift(message);
    this.localStorageService.set('modefyLog', log);
  }
  ngOnInit() {
  }
}

