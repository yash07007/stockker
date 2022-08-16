import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() {}

    getPortfolio(): any {
        let portfolio: any = localStorage.getItem('portfolio');
        portfolio = JSON.parse(portfolio);
        return portfolio;
    }

    setPortfolio(portfolio: any): void {
        portfolio = JSON.stringify(portfolio);
        localStorage.setItem('portfolio', portfolio);
    }
}
