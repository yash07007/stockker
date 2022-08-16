import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    faCaretUp,
    faCaretDown,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { DataLoaderService } from 'src/app/services/data-loader.service';
import { IFavourites, IPrice, IProfile } from '../../interfaces/interfaces';

@Component({
    selector: 'app-watchlist',
    templateUrl: './watchlist.component.html',
    styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
    public faCaretUp = faCaretUp;
    public faCaretDown = faCaretDown;
    public faTimes = faTimes;
    public favourites = [] as IFavourites[];
    public companyProfile = {} as IProfile;
    public stockPrice = {} as IPrice;
    public dataLoaded: boolean[] = [];
    public showPane: boolean = false;

    constructor(
        public router: Router,
        private _dataLoader: DataLoaderService
    ) {}

    ngOnInit(): void {
        let state: any = localStorage.getItem('favourites');
        state = JSON.parse(state);

        if (state) {
            for (let i = 0; i < state.length; i++) {
                this.dataLoaded.push(false);
                this.dataLoaded.push(false);
            }

            for (let i = 0; i < state.length; i++) {
                const ticker = state[i];
                const displayItem = {} as IFavourites;

                this._dataLoader.getCompanyProfile(ticker).subscribe({
                    next: (data) => {
                        displayItem.companyProfile = data;
                        this.dataLoaded[2 * i] = true;
                        this.showPane = this.dataLoaded.every((elem) => !!elem);
                    },
                });

                this._dataLoader.getStockPrice(ticker).subscribe({
                    next: (data) => {
                        displayItem.stockPrice = data;
                        this.dataLoaded[2 * i + 1] = true;
                        this.showPane = this.dataLoaded.every((elem) => !!elem);
                    },
                });
                this.favourites.push(displayItem);
            }
        }
    }

    public removeFromFavourites(ticker: string): void {
        let state: any = localStorage.getItem('favourites');
        state = JSON.parse(state);
        state = state.filter((e: string) => e !== ticker);
        localStorage.setItem('favourites', JSON.stringify(state));

        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }
}
