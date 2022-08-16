import { Component, OnInit } from '@angular/core';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DataLoaderService } from '../../services/data-loader.service';
import { FormControl, FormGroup } from '@angular/forms';
import {
    IProfile,
    IPrice,
    INews,
    ISentiments,
    ISearch,
    ISearchObj,
    IHistory,
    ITrends,
    IEarnings,
} from '../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { StateService } from 'src/app/services/state.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
    // Static Variables
    public faSearch = faSearch;
    public faTimes = faTimes;

    // State Variables
    public ticker: string = '';
    public companyProfile = {} as IProfile;
    public companyProfileObserver: any;
    public stockPrice = {} as IPrice;
    public stockPriceObserver: any;
    public stockHistoryForSummary = {} as IHistory;
    public stockHistoryForSummaryObserver: any;
    public stockHistoryForCharts = {} as IHistory;
    public stockHistoryForChartsObserver: any;
    public companyNews = [] as INews[];
    public companyNewsObserver: any;
    public companyPeers: string[] = [];
    public companyPeersObserver: any;
    public companySentiments = {} as ISentiments;
    public companySentimentsObserver: any;
    public companyTrends = {} as ITrends;
    public companyTrendsObserver: any;
    public companyEarnings = {} as IEarnings;
    public companyEarningsObserver: any;
    public searchOptions = [] as ISearch[];
    public searchOptionsObserver: any;
    public searchInterval: any;
    public currentState: any;

    // Helper Variables
    public dataLoaded: boolean[] = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ];
    public showPane: boolean = false;
    public loading: boolean = false;
    public mainLoader: boolean = false;
    public isFavourite: boolean = false;
    public errorMessage: string = '';
    public lastSearchTime: string = '';

    public searchForm = new FormGroup({
        searchBar: new FormControl(''),
    });

    constructor(
        private _dataLoader: DataLoaderService,
        public router: Router,
        public route: ActivatedRoute,
        private _state: StateService
    ) {}
    ngOnInit(): void {
        // initializing localStorage if its not been done before
        if (!localStorage.getItem('favourites')) {
            localStorage.setItem('favourites', JSON.stringify([]));
        }
        if (!localStorage.getItem('portfolio')) {
            localStorage.setItem(
                'portfolio',
                JSON.stringify({ balance: 25000, stocks: {} })
            );
        }
        this.currentState = this._state.state$.getValue() || {};
        const errorInState = this._state.error$.getValue();

        if (errorInState) {
            this.displayError(errorInState);
            this.deleteState();
            this._state.error$.next('');
            return;
        }

        const tickerFromUrl = this.route.snapshot.paramMap.get('ticker');

        if (
            Object.keys(this.currentState).length != 0 &&
            this.currentState.ticker == tickerFromUrl
        ) {
            this.ticker = this.currentState.ticker;
            this.companyProfile = this.currentState.companyProfile;
            this.stockPrice = this.currentState.stockPrice;
            this.stockHistoryForSummary =
                this.currentState.stockHistoryForSummary;
            this.stockHistoryForCharts =
                this.currentState.stockHistoryForCharts;
            this.companyNews = this.currentState.companyNews;
            this.companyPeers = this.currentState.companyPeers;
            this.companySentiments = this.currentState.companySentiments;
            this.companyTrends = this.currentState.companyTrends;
            this.companyEarnings = this.currentState.companyEarnings;
            this.lastSearchTime = this.currentState.lastSearchTime;
            this.getLatestPrice();
            this.showPane = true;
            this.searchForm.controls['searchBar'].setValue(
                this.currentState.ticker
            );
            this.updateFavourites();
            return;
        }

        // get ticker from route if available
        this.route.params.subscribe((params) => {
            this.ticker = params['ticker'];
            if (this.ticker) {
                this.searchForm.controls['searchBar'].setValue(this.ticker);
                this.search();
            }
        });

        // watching for input changes to call search api for auto complete
        this.searchForm.controls['searchBar'].valueChanges.subscribe(
            (changedValue) => {
                if (changedValue && changedValue.length >= 1) {
                    this.loading = true;
                    if (this.searchOptionsObserver) {
                        this.searchOptionsObserver.unsubscribe();
                    }
                    this.searchOptionsObserver = this._dataLoader
                        .getTickerSearch(changedValue)
                        .subscribe({
                            next: (response: ISearchObj) => {
                                this.searchOptions = this._filter(
                                    response.result,
                                    changedValue
                                );
                                this.loading = false;
                            },
                        });
                }
            }
        );
    }

    public onSubmit(): void {
        // Kill Unfulfilled Requests
        if (this.companyProfileObserver) {
            this.companyProfileObserver.unsubscribe();
        }
        if (this.stockPriceObserver) {
            this.stockPriceObserver.unsubscribe();
        }
        if (this.stockHistoryForSummaryObserver) {
            this.stockHistoryForSummaryObserver.unsubscribe();
        }
        if (this.stockHistoryForChartsObserver) {
            this.stockHistoryForChartsObserver.unsubscribe();
        }
        if (this.companyNewsObserver) {
            this.companyNewsObserver.unsubscribe();
        }
        if (this.companyPeersObserver) {
            this.companyPeersObserver.unsubscribe();
        }
        if (this.companySentimentsObserver) {
            this.companySentimentsObserver.unsubscribe();
        }
        if (this.companyTrendsObserver) {
            this.companyTrendsObserver.unsubscribe();
        }
        if (this.companyEarningsObserver) {
            this.companyEarningsObserver.unsubscribe();
        }

        this.ticker = this.searchForm.controls['searchBar'].value;

        if (this.ticker == '') {
            this._state.error$.next('Please enter a valid ticker');
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/search', 'home']);
        } else {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/search', this.ticker]);
        }
    }

    public onAutoCompleteSelect(ticker: string): void {
        this.searchForm.controls['searchBar'].setValue(ticker);
        this.onSubmit();
    }

    public search(): void {
        this.mainLoader = true;
        this.errorMessage = '';

        this.ticker = this.ticker.toUpperCase();
        this.stateUpdate('ticker', this.ticker);

        // checking if ticker is already in favourites and updating star display boolean
        this.updateFavourites();

        this.companyProfileObserver = this._dataLoader
            .getCompanyProfile(this.ticker)
            .subscribe({
                next: (data) => {
                    this.companyProfile = data;
                    this.stateUpdate('companyProfile', this.companyProfile);
                    this.dataLoaded[0] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error, false),
            });

        this.stockPriceObserver = this._dataLoader
            .getStockPrice(this.ticker)
            .subscribe({
                next: (data) => {
                    this.stockPrice = data;
                    this.stateUpdate('stockPrice', this.stockPrice);
                    this.loadChart(this.stockPrice.t);
                    this.dataLoaded[1] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error),
            });

        this.getLatestPrice();

        this.companyNewsObserver = this._dataLoader
            .getCompanyNews(this.ticker)
            .subscribe({
                next: (data) => {
                    this.companyNews = data.result;
                    this.stateUpdate('companyNews', this.companyNews);
                    this.dataLoaded[3] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error),
            });

        this.companyPeersObserver = this._dataLoader
            .getCompanyPeers(this.ticker)
            .subscribe({
                next: (data) => {
                    this.companyPeers = data;
                    this.stateUpdate('companyPeers', this.companyPeers);
                    this.dataLoaded[4] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error),
            });

        this.companySentimentsObserver = this._dataLoader
            .getCompanySentiments(this.ticker)
            .subscribe({
                next: (data) => {
                    this.companySentiments = data;
                    this.stateUpdate(
                        'companySentiments',
                        this.companySentiments
                    );
                    this.dataLoaded[5] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error),
            });

        const to = dayjs();
        const from = to.subtract(2, 'year');
        const to_unix = to.unix();
        const from_unix = from.unix();

        this.stockHistoryForChartsObserver = this._dataLoader
            .getStockHistory(this.ticker, from_unix, to_unix, 'D')
            .subscribe({
                next: (data) => {
                    this.stockHistoryForCharts = data;
                    this.stateUpdate(
                        'stockHistoryForCharts',
                        this.stockHistoryForCharts
                    );

                    this.dataLoaded[6] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error),
            });

        this.companyTrendsObserver = this._dataLoader
            .getCompanyTrends(this.ticker)
            .subscribe({
                next: (data) => {
                    this.companyTrends = data;
                    this.stateUpdate('companyTrends', this.companyTrends);
                    this.dataLoaded[7] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error),
            });

        this.companyEarningsObserver = this._dataLoader
            .getCompanyEarnings(this.ticker)
            .subscribe({
                next: (data) => {
                    this.companyEarnings = data;
                    this.stateUpdate('companyEarnings', this.companyEarnings);
                    this.dataLoaded[8] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error),
            });

        this.lastSearchTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        this.stateUpdate('lastSearchTime', this.lastSearchTime);
    }

    public loadChart(timestamp: number): void {
        const isMarketOpen = this.isMarketOpen(timestamp);
        let to_unix: number;
        let from_unix: number;
        if (isMarketOpen) {
            const to = dayjs();
            const from = to.subtract(6, 'hour');
            to_unix = to.unix();
            from_unix = from.unix();
        } else {
            const to = dayjs.unix(timestamp);
            const from = to.subtract(6, 'hour');
            to_unix = to.unix();
            from_unix = from.unix();
        }

        this.stockHistoryForSummaryObserver = this._dataLoader
            .getStockHistory(this.ticker, from_unix, to_unix, '5')
            .subscribe({
                next: (data) => {
                    this.stockHistoryForSummary = data;
                    this.stateUpdate(
                        'stockHistoryForSummary',
                        this.stockHistoryForSummary
                    );
                    this.dataLoaded[2] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
                error: (error) => this.displayError(error),
            });
    }

    public getLatestPrice(): void {
        this.searchInterval = setInterval(() => {
            if (this.isMarketOpen(this.stockPrice.t)) {
                this.stockPriceObserver = this._dataLoader
                    .getStockPrice(this.ticker)
                    .subscribe({
                        next: (data) => {
                            this.stockPrice = data;
                            this.stateUpdate('stockPrice', this.stockPrice);
                            this.lastSearchTime = dayjs().format(
                                'YYYY-MM-DD HH:mm:ss'
                            );
                            this.stateUpdate(
                                'lastSearchTime',
                                this.lastSearchTime
                            );
                            this.loadChart(this.stockPrice.t);
                        },
                        error: (error) => {
                            this.displayError(error);
                        },
                    });
            }
        }, 15000);
    }

    private _filter(results: ISearch[], currentSearch: string): ISearch[] {
        results = results.filter(
            (result) =>
                result.type === 'Common Stock' &&
                result.symbol.includes(currentSearch.toUpperCase()) &&
                !result.symbol.includes('.')
        );
        return results;
    }

    public updateFavourites() {
        let favourites: any = localStorage.getItem('favourites');
        favourites = JSON.parse(favourites);

        if (favourites.includes(this.ticker)) {
            this.isFavourite = true;
        } else {
            this.isFavourite = false;
        }
    }

    public displayOptions(item: ISearch): string {
        return `${item.symbol} | ${item.description}`;
    }

    public displayError(error: any, no404: boolean = true): void {
        if (error.status == 404) {
            if (no404) {
                return;
            }
            console.log(error);
            this.errorMessage = 'No data found. Please enter a valid Ticker';
        } else if (error.status == 429) {
            console.log(error);
            this.errorMessage =
                'API Limit Reached. Please try again after Sometime';
        } else {
            this.errorMessage = error;
        }
        if (this.searchInterval) {
            clearInterval(this.searchInterval);
        }
        this.deleteState();
        this.mainLoader = false;
        this.showPane = false;
    }

    public isMarketOpen(lastTimestamp: number): boolean {
        const now = dayjs();

        if (now.diff(dayjs.unix(lastTimestamp), 'm') > 5) {
            return false;
        } else {
            return true;
        }
    }

    public resetForm(): void {
        if (this.searchInterval) {
            clearInterval(this.searchInterval);
        }
        this.mainLoader = false;
        this.deleteState();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['search', 'home']);
    }

    public stateUpdate(key: string, value: any): void {
        this.currentState[key] = value;
        this._state.state$.next(this.currentState);
    }

    public deleteState() {
        this.currentState.ticker = '';
        this._state.state$.next(this.currentState);
    }
}
