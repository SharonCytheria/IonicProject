import { ProductServiceService } from './../../../shared/services/product-service.service';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/class/product';

@Component({
  selector: 'app-storage-log',
  templateUrl: './storage-log.page.html',
  styleUrls: ['./storage-log.page.scss'],
})
export class StorageLogPage implements OnInit {
  product: Product;
  Logs: [{
    time: string,
    type: string,
    num: number,
    status: boolean,
  }];
  constructor(
    private localStorageService: LocalStorageService,
    private productService: ProductServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { 
    const barcode = this.activatedRoute.snapshot.params['barcode'];
    this.product = this.productService.getProductByBarcode(barcode);
    //console.log(this.product.barcode);
    this.ionViewDidEnter();
    //this.Logs = this.localStorageService.get('StorageLog', []);
  }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.Logs = this.localStorageService.get('StorageLog', []);
  }
}
