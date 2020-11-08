import { PassportServiceService } from './../../shared/services/passport-service.service';
import { CategoryListServiceService } from './../../shared/services/category-list-service.service';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/category';
import { ActionSheetController, MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {
  categories: Category[];
  activeCategory: Category;
  activeSubCategory: Category;
  activeSubCategories: Category[];
  private CategoryLength = 0;
  constructor(
    private categoryService: CategoryListServiceService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private menuController: MenuController,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((params) =>{
      this.categoryService.getAll().then((data) => {
        this.categories = data.result;
        if(this.categories) {
          this.activeCategory = this.categories[0];
          this.activeSubCategories = this.activeCategory.children;
        }
        this.CategoryLength = this.activeSubCategories.length;
      });
    })
  }
  async onPresentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
        header: '选择您的操作',
        buttons: [
          {
            text: '新增小分类',
            role: 'destructive',
            handler: () => {
              this.router.navigate(["/category/add"],{
                queryParams: {
                  title: this.activeCategory.name, categoryid: this.activeCategory.id,
                },
              })
            }
          },{
            text: '编辑分类',
            handler: () => {
              this.router.navigate(["/category/edit", this.activeCategory.id]);
            }
          },{
            text: '取消',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    await actionSheet.present();
  }
  getItemColor(id: number): string {
    if (id === this.activeCategory.id) {
      return '';
    } else {
      return 'light';
    }
  }
  selectCategory(category: Category) {
    this.activeCategory = category;
    this.activeSubCategories = this.activeCategory.children;
    this.CategoryLength = this.activeSubCategories.length;
  }
  onSelect(category: Category){
    this.categoryService.setActiveCategory(category);
    this.location.back();
  }

  ionViewWillEnter(){
    this.menuController.enable(true);
  }
  ionViewDidLeave(){
    this.menuController.enable(true);
  }
  GoToAddPage(number){
    if(number == 0) {
      this.router.navigate(["/category/add"],{
        queryParams: {title: "大分类", mainid:this.categories.length},
      });
    } else {
      this.router.navigate(["/category/add"],{
        queryParams: {
          title: this.activeCategory.name,
          categoryid: this.activeCategory.id,
        },
      });
    }
  }
}
