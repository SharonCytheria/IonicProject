import { CategoryListServiceService } from './../../../shared/services/category-list-service.service';
import { ProductServiceService } from './../../../shared/services/product-service.service';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/class/product';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker,ImagePickerOptions, OutputType } from '@ionic-native/image-picker/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit, OnDestroy{
  product: Product;
  subscription: Subscription;
  constructor(
    private actionSheetController: ActionSheetController,
    private productService: ProductServiceService,
    private alertController: AlertController,
    private router: Router,
    private zone: NgZone,
    private categoryService: CategoryListServiceService,
    private barcodeScanner: BarcodeScanner, 
    private camera: Camera,
    private imagePicker: ImagePicker,
    private statusBar: StatusBar,
  ) { 
    this.subscription = categoryService.watchCategory().subscribe( //use subscribe 
      (activeCategory)=> {
      this.product.categoryName = activeCategory.name;
      this.product.categoryId = activeCategory.id;
    }, (error) => {
      console.log(error)
    });
    //this.initiateProduct();
    this.product = this.productService.intiProduct();
    this.product.categoryName="默认分类";
    //---------statusBar
    this.statusBar.overlaysWebView(true);
  }
  ngOnInit() {
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  // Delete this method, put it into ProductService. 
  // Because it can be used a thousand times.
  // private initiateProduct(): void {
  //   this.product = {
  //     id: "",
  //     name: "",
  //     categoryId: null,
  //     categoryName: "",
  //     category: "",
  //     barcode:"",
  //     images: [],
  //     price: null,
  //     StorageNum: null,
  //     supplier: null,
  //     importPrice: null,
  //     standard: null,
  //     remark: "",
  //   };
  // }
  
  async onPresentActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      //The ActionSheet plugin shows a native list of options the user can choose from.
      //A button's role property can either be destructive or cancel.
      //Buttons without a role property will have the default look for the platform. 
      //Buttons with the cancel role will always load as the bottom button, no matter where they are in the array. 
      header: "选择您的操作",
      buttons: [{
        text: "拍照",
        role: "destructive", //The first one
        handler: ()=> {
          console.log('camera'); 
          this.onCamera();
        }
      },{
        text: "相册",
        handler: ()=>{
          console.log('Photos');
          this.onImagePicker();
         }
      },{
        text: "取消",
        role: "cancel",
        handler: ()=>{
          console.log('cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  async onSave(continues: boolean = false){
    this.productService.insert(this.product).then(async (data) =>{
      if(data.success){
        const alert = await this.alertController.create({
          header: "提示",
          message: "添加成功",
          buttons: ["确定"],
        });
        alert.present();
        this.router.navigateByUrl("/product/list");
        if(continues){
          //this.initiateProduct();
          this.productService.intiProduct();
          this.product.categoryName = "默认分类";
        } else {
        } 
      } else {
        const alert = await this.alertController.create({
          header: "提示",
          message: "添加失败",
          buttons: ["确定"],
        });
        alert.present();
      }
    });
  }
  GoToCategoryList(){
    this.router.navigateByUrl("/category-list");
  }
  // 使用Barcode Scanner插件实现二维码、条形码扫描
  // kind of an interface ?
  onScan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      // others
      //ßalert(JSON.stringify(barcodeData));
      this.product.barcode=barcodeData.text;
    }).catch(err => {
      console.log('Error', err);
      alert(err);
    });
  }
  /*
  JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  */
  onCamera(){
    const options: CameraOptions = {
      quality: 10,
      // Note, Decrease the quality . 
      // We don't need that much, 
      // And it will take a lot of memory.
      destinationType: this.camera.DestinationType.DATA_URL,
      //Change the original one to DATA_URL, cause the original one is not right.
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then((imageData) => {
        let base64Image = 'data:image/jpeg;base64,'+ imageData;
        //Push the images we take into the images[] we define in class Product
        this.product.images.push(base64Image);
        console.log('I was used.');
      }, (err) => {
        //Handle error
      }); 
  }
  onImagePicker(){
    const options: ImagePickerOptions = {
      maximumImagesCount: 4,
      quality: 10,
      //The same,
      outputType: OutputType.DATA_URL
    };
    this.imagePicker.getPictures(options).then((results) => {
      const images = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < results.length; i++) {
        this.product.images.push('data:image/jpeg;base64,' + results[i]);
      }
    }, (err) => {
      console.log(err);
    });
  }

}
