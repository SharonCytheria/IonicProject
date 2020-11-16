import { ProductPageResult } from './../interfaces/product-page-result';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { UUID } from "angular2-uuid";
import { Product } from '../class/product';
import { AjaxResult } from '../class/ajax-result';
import { NullTemplateVisitor } from '@angular/compiler';
import { findReadVarNames } from '@angular/compiler/src/output/output_ast';
@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private localStorageService: LocalStorageService) { }
  async insert(input: Product): Promise<AjaxResult>{
    input.id = UUID.UUID();
    const temp = this.localStorageService.get("product",[]);
    temp.push(input);
    console.log(temp);
    this.localStorageService.set("product", temp);
    return {
      targetUrl: "",
      result: temp,
      success: true,
      error: null,
      unAuthorizedRequest: false,
    };
  }
  intiProduct(): Product {
    return {
      id: '',
      name: '',
      categoryId: null,
      categoryName: '',
      category: null,
      barcode: '',
      images: [],
      price: null,
      importPrice: null,
      StorageNum: null,
      supplier: null,
      standard: '',
      remark: '',
    };
  }
  AutoIncrecement(array: Product[]): string{
    if(array.length === 0)
      return "";
    const new_id = array[length-1].id + 1;
    return new_id;
  }
  //-----------need to fill
  async getList(index: number, size: number): Promise<AjaxResult> {
    if (index < 0) {
      // 实际开发中应抛出异常类对象
      throw new Error('分页的索引应大于等于零');
    }
    if (size <= 0) {
      // 实际开发中应抛出异常类对象
      throw new Error('每页显示的记录数应大于零');
    }
    let temp = this.localStorageService.get('product',[]);
     //从本地存储中获取商品的数据，使用数组提供的slice(start,end)方法，从已有的数组中返回指定的元素。
    const productPageResult: ProductPageResult = {
      totalCount: temp.length,
      products: temp.slice((index - 1) * size, index * size)
    }
    return {
      targetUrl: '',
      result: productPageResult,
      success: true,
      error: null,
      unAuthorizedRequest: false,
    };
    // 其他代码省略
   
  }
  
 /*
  getListByCategoryId(index: number, size: number, categoryId: number): Promise<AjaxResult> {
    //参考之前任务，使用RxJS实现。

  }
    */
  async getListByCategoryName(index: number, size: number, CategoryName: string): Promise<AjaxResult>{
    if (index < 0) {
      // 实际开发中应抛出异常类对象
      throw new Error('分页的索引应大于等于零');
    }
    if (size <= 0) {
      // 实际开发中应抛出异常类对象
      throw new Error('每页显示的记录数应大于零');
    } 
    const products = this.localStorageService.get('product', []);
    let temp = [];
    for(const product of products){
      if(product.categoryName === CategoryName){
        temp.push(product);
      }
    }
    temp = temp.slice((index - 1) * size, index * size);
    return {
      targetUrl: '',
      result:temp,
      success: true,
      error: null,
      unAuthorizedRequest: false, 
    };

    
  }

  async getListByCondition(index: number, size: 10, input :any): Promise<AjaxResult>{
    const products = this.localStorageService.get('product',[]);
    let temp = [];
    for(const product of products){
      if(product.name.toString().indexOf(input) !== -1 || product.barcode.toString().indexOf(input) !== -1 || product.price.toString().indexOf(input) !== -1){
        //模糊查找，类似于寻找子串；即input是否为name的子串，若不是返回-1；
        temp.push(product);
      }
    }
    const total = temp.length;
    temp = temp.slice((index - 1) * size, index * size);
    return {
      targetUrl:'',
      result: temp,
      success: true,
      error: null,
      unAuthorizedRequest: false,
    };
  }

  async totalNumOfCommodity(): Promise<AjaxResult>{
    const num = this.localStorageService.get('product',[]).length;
    return {
      targetUrl: '',
      result: num,
      success: true,
      error: null,
      unAuthorizedRequest: false,
    };
  }
  getProductByBarcode(barcode: string) : Product {
    const products = this.localStorageService.get('product', []);
    let temp = this.intiProduct();
    for(const product of products){
      if(product.barcode == barcode){
        temp = product;
        break;
      }
    }
    return temp;
  }
  modifyProduct(product: Product): boolean {
    const products = this.localStorageService.get('product', []);
    for(let i = 0; i < products.length; i++){
      if(products[i].barcode == product.barcode){
        products[i] = product;
        this.localStorageService.set('product', products);
        return true;
      }
    }
    return false;
  }
  deleteProductByBarcode(barcode: string): boolean {
    const temp = this.localStorageService.get('product', []);
    if( temp === null || temp.length === 0){
      return false;
    }
    for(let i = 0; i < temp.length; i++){
      if(temp[i].barcode == barcode){
        temp.splice(i, 1);
        this.localStorageService.set('product', temp);
        return true;
      }
    }
    return false;
  }
}
