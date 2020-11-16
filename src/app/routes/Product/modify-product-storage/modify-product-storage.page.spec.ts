import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModifyProductStoragePage } from './modify-product-storage.page';

describe('ModifyProductStoragePage', () => {
  let component: ModifyProductStoragePage;
  let fixture: ComponentFixture<ModifyProductStoragePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyProductStoragePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyProductStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
