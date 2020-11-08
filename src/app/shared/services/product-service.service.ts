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
}
