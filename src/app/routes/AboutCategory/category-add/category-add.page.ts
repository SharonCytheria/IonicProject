import { CategoryListServiceService } from './../../../shared/services/category-list-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/category';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.page.html',
  styleUrls: ['./category-add.page.scss'],
})
export class CategoryAddPage implements OnInit {
  category: Category;
  subid = 0;
  title: any;
  Mname: string;
  Title: any;
  mainid = 5;
  constructor(
    private activatedRouter: ActivatedRoute,
    private categoryService: CategoryListServiceService, //em
    private toastController: ToastController,
    private router: Router,
  ) { 
    this.activatedRouter.queryParams.subscribe((queryParams) => { //To get the parameters from url
      this.title = queryParams.title;
      if(this.title !== "大分类"){
        this.Title = "新增小分类";
        this.category = {
          id: 0,
          name: "",
          children: [{
            id: 0,
            name: "",
            children: [],
          },],
        };
      } else {
        this.Title = "新增商品分类";
        this.category = {
          id: ++this.mainid,
          name: "",
          children: [{
            id: 0,
            name: "",
            children: [],
          },],
        };
      }
    });
  }
  onAddSubCategory(){ // add subCategory into the Category, and increase the id automatically 
    this.category.children.push({
      id: ++this.subid,
      name: "",
      children: [],
    });
  }
  ngOnInit() {
  }
  async onSave(){
    if(this.title === "大分类"){
      this.category.name = this.Mname;
      if(this.categoryService.insert(this.category) === true){
        const toast = await this.toastController.create({
          //toast only presents for a little while, and you don't need to click anything.
          message: "成功添加大分类",
          duration: 3000, //as it says
        });
        this.router.navigateByUrl("/category-list");
        toast.present();
      } else if(this.category.name === null){
        const toast = await this.toastController.create({
          message: "请输入类别名",
          duration: 3000,
        });
        toast.present(); 
        } else {
        const toast = await this.toastController.create({
          message: "因名称重复，新增失败",
          duration: 3000,
        });
        toast.present();
      }
    } else if(this.category.name === null){
      const toast = await this.toastController.create({
        message: "请输入类别名",
        duration: 3000,
      });
      toast.present(); 
      } else { //this.title !== "大分类" and this.category.name !== null
      this.category.name = this.title;
      if(this.categoryService.insertSubCategory(this.category) === true){  
        // check categoryService/categoryListService for sure 
        // A lot of things to check to make sure we can actually add it.
        // If everything is ok 
        const toast = await this.toastController.create({
          message: "成功添加小分类",
          duration: 3000,
        });
        this.router.navigateByUrl("/category-list");
        toast.present();
      } else if(this.category.name === null){
        const toast = await this.toastController.create({
          message: "请输入类别名",
          duration: 3000,
        });
        toast.present(); 
        } else {
        const toast = await this.toastController.create({
          message: "因名称重复，新增失败",
          duration: 3000,
        });
        toast.present();
      }
    }
  }
}
