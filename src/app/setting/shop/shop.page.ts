import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  shop: any;
  createTime: any;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((params) =>{
      this.shopDataInit();
    });
  }
  onBack(){
    this.router.navigateByUrl('setting');
  }
  shopDataInit(){
    const id = this.localStorageService.get("LoginLog", "").identifier;
    this.shop = this.localStorageService.get("shop","");
    this.createTime = this.shop.createTime;
  }

}
