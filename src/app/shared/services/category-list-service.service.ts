import { LocalStorageService } from './local-storage.service';
import { Injectable, ViewChild } from '@angular/core';
import { AjaxResult } from '../class/ajax-result';
import { CATEGORIES } from '../mock.categories';
import { Subject, Observable } from 'rxjs';
import { Category } from '../category';
import { ActiveCategory } from '../class/active-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryListServiceService {
  categorySubject = new Subject<ActiveCategory>();
  constructor(
    private localStorageService: LocalStorageService
  ) { }
  async getAll(): Promise<AjaxResult> {
    const categories = this.localStorageService.get("Category", CATEGORIES);
    return {
      targetUrl: "",
      result: categories,
      success: true,
      error: null,
      unAuthorizedRequest: false,
    };
  }
  insert(category: Category):boolean {
    if(category == null){
      return false;
    }
    if(this.isUniqueName(category) === false){
      return false;
    }
    const tempC = this.localStorageService.get("Category", CATEGORIES);
    tempC.push(category);
    this.localStorageService.set("Category", tempC);
    return true;
  }
  isUniqueName(category: Category): boolean{
    if(category == null || category.name === ""){
      return false;
    }
    for(let i = 0; i < category.children.length - 1; i ++)
    {
      for(let j = i + 1; j < category.children.length; j ++){
        if(category.children[i].name == category.children[j].name){
          return false;
        }
      }
    }
    return true;
  }
  insertSubCategory(category: Category): boolean {
    if(category === null){
      return false;
    }
    const temp = this.localStorageService.get("Category", CATEGORIES);
    const index = this.getCategoryIndexByName(category.name);
    if(index === -1){ // not found
      return false;
    }
    for(let i = 0; i < category.children.length; i++){ //!!!!!!!!!!!
      temp[index].children.push(category.children[i]);
    }
    if(this.isUniqueName(temp[index]) === false){
      return false;
    } else {
      this.update(temp);
      return true;
    }
  }
  getCategoryIndexByName(name: string): number{
    const cate = this.localStorageService.get("Category", CATEGORIES);
    for(let i = 0; i < cate.length; i++){
      if(cate[i].name == name)
        return i;
    }
    return -1;
  }
  getCategoryIndexById(id: number): number{
    const cate = this.all();
    for(let i = 0; i < cate.length; i++){
      if(cate[i].id == id)
        return i;
    }
    return -1;
  }
  getCategoryById(id: number): Category{
    const cate = this.localStorageService.get("Category", CATEGORIES);
    for(let i = 0; i < cate.length; i++){
      if(cate[i].id == id){
        return cate[i];
      }
    }
    return null;
  }
  update(category: Category[]){
    this.localStorageService.set("Category", category);
  }
  all(): Category[]{
    return this.localStorageService.get("Category", CATEGORIES);
  }
  onDeleteCategoryById(id: number): boolean {
    const temp = this.localStorageService.get("Category", CATEGORIES);
    for( let i = 0; i < temp.length; i++)
    {
      if( temp[i].id == id){
        temp.splice(i, 1);
        this.localStorageService.set("Category", temp);
        return true;
      }
    }
    return false;
  }
  onDeleteSubCategoryById(category: Category, id: number): boolean {
    if(category == null)
      return false;
    for( let i = 0; i < category.children.length; i++){
      if(category.children[i].id == id){
        const index = this.getCategoryIndexByName(category.name);
        let temp = this.localStorageService.get("Category", CATEGORIES);
        temp[index].children.splice(i, 1);
        this.localStorageService.set("Category", temp);
        return true;
      }
    }
    return false;
  }
  modifyCategory(cate: Category): boolean{
    const index = this.getCategoryIndexById(cate.id);
    if(index === -1)
      return false;
    let temp = this.localStorageService.get("Category", CATEGORIES);
    temp[index] = cate;
    this.update(temp);
    return true;
  }
  //用于返回可观察者
  watchCategory():Observable<ActiveCategory>{
    return this.categorySubject.asObservable();
  }
  //向订阅者发送通知，传送数据
  setActiveCategory(category: ActiveCategory){
    this.categorySubject.next(category);
  }
}
