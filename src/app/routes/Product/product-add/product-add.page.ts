import { CategoryListServiceService } from './../../../shared/services/category-list-service.service';
import { ProductServiceService } from './../../../shared/services/product-service.service';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/class/product';
import { Router } from '@angular/router';

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
  ) { 
    this.subscription = categoryService.watchCategory().subscribe(
      (activeCategory)=> {
      this.product.categoryName = activeCategory.name
    }, (error) => {
      console.log(error)
    });
    this.initiateProduct();
    this.product.categoryName="默认分类";
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  private initiateProduct(): void {
    this.product = {
      id: "",
      name: "",
      categoryId: null,
      categoryName: "",
      category: "",
      barcode:"",
      images: [],
      price: null,
    };
  }
  
  async onPresentActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: "选择您的操作",
      buttons: [{
        text: "拍照",
        role: "destructive",
        handler: ()=> {
          console.log('camera');
        }
      },{
        text: "相册",
        handler: ()=>{
          console.log('Photos');
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
        if(continues){
          this.initiateProduct();
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
}
