import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import {
    faStar as faStarSolid,
    faCaretUp,
    faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import {
    IProfile,
    IPrice,
    INews,
    ISentiments,
    IHistory,
    ITrends,
    IEarnings,
} from '../../interfaces/interfaces';
import { NgbModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-search-pane',
    templateUrl: './search-pane.component.html',
    styleUrls: ['./search-pane.component.css'],
})
export class SearchPaneComponent implements OnInit {
    // Icons
    public faStarOutline = faStarOutline;
    public faStarSolid = faStarSolid;
    public faCaretUp = faCaretUp;
    public faCaretDown = faCaretDown;

    // Helper Variables
    public watchlistAlertMessage: string = '';
    public watchlistAlertType: string = '';
    public watchlistAlertTimeout: any;
    public portfolioAlertMessage: string = '';
    public portfolioAlertType: string = '';
    public portfilioAlertTimeout: any;
    public buyQuantity: number = 1;
    public sellQuantity: number = 1;

    @Input() companyProfile = {} as IProfile;
    @Input() stockPrice = {} as IPrice;
    @Input() stockHistoryForSummary = {} as IHistory;
    @Input() stockHistoryForCharts = {} as IHistory;
    @Input() companyNews = [] as INews[];
    @Input() companyPeers: string[] = [];
    @Input() companySentiments = {} as ISentiments;
    @Input() companyTrends = {} as ITrends;
    @Input() companyEarnings = {} as IEarnings;
    @Input() isMarketOpen = {} as (lastTimestamp: number) => boolean;
    @Input() lastSearchTime: string = '';
    @Input() isFavourite: boolean = false;

    @ViewChild('watchlistAlert', { static: false }) watchlistAlert!: NgbAlert;
    @ViewChild('portfolioAlert', { static: false }) portfolioAlert!: NgbAlert;

    constructor(
        public modalService: NgbModal,
        public storage: StorageService
    ) {}

    ngOnInit(): void {}
    ngOnChanges(): void {}

    public addToFavourites(): void {
        this.isFavourite = true;
        this.displayWatchlistAlert(
            this.companyProfile.ticker + ' added to Watchlist',
            'success'
        );
        
        let favourites: any = localStorage.getItem('favourites');
        favourites = JSON.parse(favourites);
        favourites.push(this.companyProfile.ticker);
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }

    public removeFromFavourites(): void {
        this.isFavourite = false;
        this.displayWatchlistAlert(
            this.companyProfile.ticker + ' removed from Watchlist',
            'danger'
        );

        let favourites: any = localStorage.getItem('favourites');
        favourites = JSON.parse(favourites);
        favourites = favourites.filter(
            (e: string) => e !== this.companyProfile.ticker
        );
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }

    public openBuyModal(buyModal: any) {
        this.modalService.open(buyModal).result.then(
            (result) => {
                const quantity = result;
                const price = quantity * this.stockPrice.c;
                const ticker = this.companyProfile.ticker;
                const portfolio = this.storage.getPortfolio();
                const stocks = portfolio.stocks;

                if (!(ticker in stocks)) {
                    stocks[ticker] = {
                        totalQuantity: quantity,
                        totalPrice: price,
                    };
                } else {
                    stocks[ticker]['totalQuantity'] += quantity;
                    stocks[ticker]['totalPrice'] += price;
                }
                portfolio.stocks = stocks;
                portfolio['balance'] -= price;
                this.storage.setPortfolio(portfolio);
                this.displayPortfolioAlert(ticker + ' bought successfully', 'success');
                this.buyQuantity = 1;
            },
            (reason) => {
                this.buyQuantity = 1;
            }
        );
    }
    // prettier-ignore
    public openSellModal(sellModal: any) {
        this.modalService.open(sellModal).result.then(
            (result) => {
                const quantity = result;
                const price = quantity * this.stockPrice.c;
                const ticker = this.companyProfile.ticker;
                const portfolio = this.storage.getPortfolio();
                const stocks = portfolio.stocks;

                const previousQuantity = stocks[ticker]['totalQuantity'];
                const previousTotalPrice = stocks[ticker]['totalPrice'];
                const previousAvgPrice = previousTotalPrice / previousQuantity;

                const newTotalPrice = previousTotalPrice - quantity * previousAvgPrice;
                const newQuantity = previousQuantity - quantity;

                stocks[ticker]['totalPrice'] = newTotalPrice;
                stocks[ticker]['totalQuantity'] = newQuantity;

                if (stocks[ticker]['totalQuantity'] == 0) {
                    delete stocks[ticker];
                }
                portfolio.stocks = stocks;
                portfolio['balance'] += price;
                this.storage.setPortfolio(portfolio);
                this.displayPortfolioAlert(ticker + ' sold successfully', 'danger');
                this.sellQuantity = 1;
            },
            (reason) => {
                this.sellQuantity = 1;
            }
        );
    }

    public haveStocks(ticker: string): boolean {
        const portfolio = this.storage.getPortfolio();
        if (ticker in portfolio['stocks']) {
            return true;
        } else {
            return false;
        }
    }

    public getQuantity(ticker: string): number {
        const stocks = this.storage.getPortfolio()['stocks'];
        if (ticker in stocks) {
            return stocks[ticker]['totalQuantity'];
        } else {
            return 0;
        }
    }

    public displayWatchlistAlert(message: string, type: string): void {
        this.watchlistAlertMessage = message;
        this.watchlistAlertType = type;
        clearTimeout(this.watchlistAlertTimeout);
        this.watchlistAlertTimeout = setTimeout(() => {
            this.watchlistAlert.close();
        }, 5000);
    }

    public displayPortfolioAlert(message: string, type: string): void {
        this.portfolioAlertMessage = message;
        this.portfolioAlertType = type;
        clearTimeout(this.portfilioAlertTimeout);
        this.portfilioAlertTimeout = setTimeout(() => {
            this.portfolioAlert.close();
        }, 5000);
    }
}
