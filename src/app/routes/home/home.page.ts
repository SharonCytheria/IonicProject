import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadStart } from '@angular/router';
import { SalesService } from 'src/app/shared/services/sales-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private sales: Array<{title: string, content: string, previous: number, current: number}>;
  options = [
    [
      {'href': '/product/add', 'name': 'add_salse', 'text': '新增商品', 'disable': false},
      {'href': '/home', 'name': 'add_user', 'text': '新增会员', 'disable': false},
      {'href': '/home', 'name': 'sales_account', 'text': '收银记账', 'disable': false},
      {'href': '/home', 'name': 'a_note', 'text': '支出管理', 'disable': false}
    ],
    [
      {'href': '/product/list', 'name': 'sales_management', 'text': '商品管理', 'disable': false},
      {'href': '/home', 'name': 'user_management', 'text': '会员管理', 'disable': false},
      {'href': '/home', 'name': 'shop_management', 'text': '查询销售', 'disable': false},
      {'href': '/home', 'name': 'analysis', 'text': '智能分析', 'disable': false}
    ],
    [
      {'href': '/home', 'name': 'gongying_more', 'text': '供应商管理', 'disable': false},
      {'href': '/home', 'name': 'guandan_more', 'text': '挂单', 'disable': false},
      {'href': '/home', 'name': 'image_addsales', 'text': '高级功能', 'disable': false},
      {'disable': true}
    ]
  ];
  constructor( private sale: SalesService) { 
    this.sales = [ 
      {title: '今日', content : '比昨日', previous: this.sale.getSales(), current: this.sale.getSales()},
      {title: '七日', content : '比同期', previous: this.sale.getSales(), current: this.sale.getSales()},
      {title: '本月', content : '比同期', previous: this.sale.getSales(), current: this.sale.getSales()}
    ];
  }

  ngOnInit() {
  }
  onMinus(current: number, previous: number): number { //used to choose the right arrow icon according to the revenue
    const result = current - previous;
    if(result > 0){ // arrow-up  red
      return 1;
    } else if(result === 0){ //even 
      return 0;
    } else {
      return -1; // arrow-down  green 
    }
  }
  onRefresh(event) { //refresh!
    setTimeout(() => {
      this.sales = [
        {
          title: "今日",
          content: "比昨日",
          previous: this.sale.getSales(),
          current: this.sale.getSales(),
        },
        {
          title: "七日",
          content: "比同期",
          previous: this.sale.getSales(),
          current: this.sale.getSales(),
        },
        {
          title: "本月",
          content: "比同期",
          previous: this.sale.getSales(),
          current: this.sale.getSales(),
        },
      ];
      event.target.complete();
    }, 1000);
  }
}
