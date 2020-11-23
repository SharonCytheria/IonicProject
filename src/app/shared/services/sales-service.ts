import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    constructor(
        private localStorageService: LocalStorageService){}
    getSales(): number{
        return Math.random() * (999 - 10000) + 100000;
    }
    
}
