import { LocalStorageService } from './../../shared/services/local-storage.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router'
export const APP_KEY: string = 'App'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomePage implements OnInit {
  showSkip = true;
  @ViewChild('slides', {static: false}) slides: IonSlides;
  constructor(private LocalStorageService:LocalStorageService, private router: Router) { }

  ngOnInit() {
    let appConfig: any = this.LocalStorageService.get('App', {
      isLaunched: false,
      version: '1.0.0'
    });
    if( appConfig.isLaunched === false ) {
      appConfig.isLaunched = true;
      this.LocalStorageService.set('App', appConfig);
    } else {
      this.router.navigateByUrl('home');
      //原为home，但改会出现ERROR Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'home'
      //Error: Cannot match any routes. URL Segment: 'home'
      //暂改为welcome
      //folder/id?
    }
  }
  onSlideWillChange(event) {
    console.log(event);
    this.slides.isEnd().then((end) => {
      this.showSkip = !end;
    });
  }
  
}
