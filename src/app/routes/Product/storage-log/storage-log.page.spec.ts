import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StorageLogPage } from './storage-log.page';

describe('StorageLogPage', () => {
  let component: StorageLogPage;
  let fixture: ComponentFixture<StorageLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageLogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StorageLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
