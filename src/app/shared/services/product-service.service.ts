import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { UUID } from "angular2-uuid";
import { Product } from '../class/product';
import { AjaxResult } from '../class/ajax-result';
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
    temp = temp.slice((index - 1) * size, index * size);
    return {
      targetUrl: '',
      result: temp,
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
      if(product.name == input || product.barcode == input || product.price == input){
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
}
