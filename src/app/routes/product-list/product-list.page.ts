import { CategoryListServiceService } from './../../shared/services/category-list-service.service';
import { CategoryAddPageModule } from './../AboutCategory/category-add/category-add.module';
import { AjaxResult } from './../../shared/class/ajax-result';
import { ProductServiceService } from './../../shared/services/product-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController, IonInfiniteScroll } from '@ionic/angular';
import { Product } from 'src/app/shared/class/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  private currentIndex: number; //当前页码
  private products: Product[]; //存放商品数据 ..!
  private total: number; //商品总记录数
  private queryTerm: string; //查询条件
  private categoryId: number; //类别编号，用于保存用户选择的类别，初始值为-1
  private totalStorageNum: number; //总正库存
  private totalPrice: number; //总成本，位于顶部
  private categoryName: string;
  private subscription: Subscription;
  private isBackFromCategoryList: boolean;
  private isAddProduct: boolean;
  private productCount: number; //总商品数量
  constructor(
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
    private productService: ProductServiceService,
    private toastController: ToastController,
    private categoryService: CategoryListServiceService,
    private router: Router
  ) {
    this.categoryId = -1;
    this.isAddProduct = false;
    this.isBackFromCategoryList = false;
    this.subscription = categoryService.watchCategory().subscribe(
      (activeCategory) => {
        if (!this.isAddProduct) {
          this.categoryName = activeCategory.name;
          this.categoryId = activeCategory.id;
          this.getCategoryByName();
          this.isBackFromCategoryList = true;
        }
      }, (error) => {
        console.log(error)
      });
      this.products = [];
  }
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  async ngOnInit() {
    //自行添加初始化代码？
    /*
    this.activatedRoute.url.subscribe((params) =>{
      
      this.productService.getList().then((data) => {
        this.categories = data.result;
        if(this.categories) {
          this.activeCategory = this.categories[0];
          this.activeSubCategories = this.activeCategory.children;
        }
        this.CategoryLength = this.activeSubCategories.length;
      });
    })*/
    const loading = await this.loadingController.create({
      message: '正在加载数据，请稍后....',
      spinner: 'bubbles',
    });
    loading.present();
    try {
      // const ajaxResult: AjaxResult = await this.productService.getList(this.currentIndex, 10);
      // this.ionViewDidEnter();
      loading.dismiss();
      //others !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    } catch (error) {
      console.log(error);
      //实际开发中应记录在日志文件中
    }
  }

  async onRefresh(event) {
    this.currentIndex = 1;
    const refresher = event.target;
    try {
      this.totalStorageNum = 0;
      this.totalPrice = 0;
      const ajaxResult: AjaxResult = await this.productService.getList(this.currentIndex, 10);
      //console.log(ajaxResult.result);
      this.products = ajaxResult.result.products;
      this.productCount = ajaxResult.result.totalCount;
      for (const product of this.products) {
        this.totalStorageNum += product.StorageNum;
        this.totalPrice += product.price * product.StorageNum;
      }
    } catch (error) {
      console.log('出现错误');
      console.log(error);
    }
    refresher.complete();
  }

  async onInfinite(event) {
    const infiniteScroll = event.target;
    this.currentIndex++;
    setTimeout(async () => {
      const ajaxResult: AjaxResult = await this.productService.getList(this.currentIndex, 10);
      if (this.productCount == this.products.length) {
        const toast = await this.toastController.create({
          message: '已是最后一页',
          duration: 3000
        });
        toast.present();
      } else {
        this.totalStorageNum = 0;
        this.totalPrice = 0;
        this.products = this.products.concat(ajaxResult.result.products);
        this.productCount = ajaxResult.result.totalCount;
        for (const product of this.products) {
          this.totalStorageNum += product.StorageNum;
          this.totalPrice += product.price * product.StorageNum;
        }
      }
      infiniteScroll.complete();
    }, 500);
    
  }
/*
  async onInfinite(event) {
    const infiniteScroll = event.target;
    this.currentIndex++;
    const ajaxResult: AjaxResult = await this.productService.getList(this.currentIndex, 10);
    if (this.totalStorageNum - (this.currentIndex - 1) * 10) {
      const toast = await this.toastController.create({
        message: '已是最后一页',
        duration: 3000
      });
      toast.present();
    } else {
      this.totalStorageNum = 0;
      this.totalPrice = 0;
      this.products = ajaxResult.result;
      for (const product of this.products) {
        this.totalStorageNum += product.StorageNum;
        this.totalPrice += product.price * product.StorageNum;
      }
    }
    infiniteScroll.complete();
  }*/
  async ionViewDidEnter() {
    if (!this.isBackFromCategoryList) {
      this.isBackFromCategoryList = false;
      this.categoryId = -1;
      this.currentIndex = 1;
      this.productService.totalNumOfCommodity().then((data) => {
        this.total = data.result;
      });
      this.totalStorageNum = 0;
      this.totalPrice = 0;
      const ajaxResult: AjaxResult = await this.productService.getList(this.currentIndex, 10);
      this.products = ajaxResult.result.products;
      this.productCount = ajaxResult.result.totalCount;
      for (const product of this.products) {
        this.totalStorageNum += product.StorageNum;
        this.totalPrice += product.price * product.StorageNum;
      }
      //console.log(this.products);
    }
  }
  addProduct() {
    this.isAddProduct = true;
    this.router.navigateByUrl('/product/add');
  }

  GoToProductDetailPage(){
    this.router.navigateByUrl('/product/detail');
  }
  async onInput(event) {
    this.currentIndex = 1;
    const condition = event.target.value;
    try {
      if (condition == '') {
        this.ionViewDidEnter();
      } else {
        this.categoryId = -1;
        this.currentIndex = 1;
        this.totalStorageNum = 0;
        this.totalPrice = 0;
        const ajaxResult: AjaxResult = await this.productService.getListByCondition(this.currentIndex, 10, condition);
        this.products = ajaxResult.result;
      // this.productCount = ajaxResult.result.totalCount;
        for (const product of this.products) {
          this.totalStorageNum += product.StorageNum;
          this.totalPrice += product.price * product.StorageNum;
          //console.log(this.totalPrice);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  getCategoryByName() {
    this.productService.getListByCategoryName(1, 10, this.categoryName).then((data) => {
      const temp = data.result;
      //console.log(res);
      if (temp.length > 0) {
        this.products = temp;
        this.totalStorageNum = 0;
        this.totalPrice = 0;
        for (const product of this.products) {
          this.totalStorageNum += product.StorageNum;
          this.totalPrice += product.price * product.StorageNum;
        }
      }
      else {
        this.products = [];
      }
    }, (error) => {
      console.log(error);
    });
  }
  searchByCategory() {
    this.isAddProduct = false;
    this.router.navigateByUrl('/category-list');
  }
}
