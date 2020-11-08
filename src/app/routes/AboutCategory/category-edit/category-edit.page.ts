import { CategoryNameEditPage } from './../category-name-edit/category-name-edit.page';
import { CategoryListServiceService } from './../../../shared/services/category-list-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/category';
import { ModalController, AlertController, NavController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.page.html',
  styleUrls: ['./category-edit.page.scss'],
})
export class CategoryEditPage implements OnInit {
  id: any;
  category: Category;
  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryListServiceService,
    private modalController: ModalController,
    private alertController: AlertController,
    private navController: NavController,
    private router: Router,
  ) { 
    this.id = this.activatedRoute.snapshot.params["id"];
    this.category = this.categoryService.getCategoryById(this.id);
  }
  private async presentModal(name: string){ //given
    const modal = await this.modalController.create({
      component: CategoryNameEditPage,
      componentProps: { value: name}
    });
    await modal.present();
    return modal.onWillDismiss();
  }

  ngOnInit() {
  }
  async onEditCategoryName(item: IonItemSliding){
    item.close();
    const { data } = await this.presentModal(this.category.name);
    if(data)
      this.category.name = data;
  }
  async onEditSubCategoryName(item: IonItemSliding, subCategory: Category){
    item.close();
    const { data } = await this.presentModal(subCategory.name);
    if(data)
      subCategory.name = data;
  }
  async onDelete(item: IonItemSliding, subId?: number){
    const alert = await this.alertController.create({
      header:"你确定要删除吗！",
      message: "请先删除该类别下的所有商品记录",
      buttons: [{
        text: "取消",
        role: "cancel",
        cssClass: "secondary",
        handler: (blah) => {
          item.close();
        },
      },{
        text: "确认",
        handler: ()=>{
          if(subId != null){
            item.close();
            this.categoryService.onDeleteSubCategoryById(this.category, subId);
            this.category = this.categoryService.getCategoryById(this.id);
          } else if(this.category.children.length == 0){
            item.close();
            this.categoryService.onDeleteCategoryById(this.category.id);
            this.router.navigateByUrl("/category-list");
          } else {
            item.close();
          }
        },
      },],
    });
    await alert.present();
  }
  ionViewDidLeave(){
    if(this.categoryService.modifyCategory(this.category)){
      console.log("success");
    } else {
      console.log("failed");
    }
  }
}
