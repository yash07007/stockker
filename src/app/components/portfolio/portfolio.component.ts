import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPortfolioItemDisplay } from 'src/app/interfaces/interfaces';
import { DataLoaderService } from 'src/app/services/data-loader.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
    public faCaretUp = faCaretUp;
    public faCaretDown = faCaretDown;
    public dataLoaded: boolean[] = [];
    public showPane: boolean = true;
    public portfolioDisplay: IPortfolioItemDisplay[] = [];
    public alertMessage: string = '';
    public alertType: string = '';
    public alertTimeout: any;
    public buyQuantity: number = 1;
    public sellQuantity: number = 1;

    @ViewChild('alert', { static: false }) alert!: NgbAlert;

    constructor(
        private _dataLoader: DataLoaderService,
        public storage: StorageService,
        public router: Router,
        public modalService: NgbModal
    ) {}

    ngOnInit(): void {
        this.loadPortfolio();
    }

    public loadPortfolio(): void {
        this.portfolioDisplay = [];
        this.dataLoaded = [];

        const portfolio = this.storage.getPortfolio();
        const stocks = portfolio.stocks;
        const tickers: string[] = [];

        for (const ticker in stocks) {
            tickers.push(ticker);
            this.dataLoaded.push(false);
            this.dataLoaded.push(false);
        }

        tickers.forEach((ticker, i) => {
            const portfolioItem = {} as IPortfolioItemDisplay;

            this._dataLoader.getCompanyProfile(ticker).subscribe({
                next: (data) => {
                    const companyProfile = data;
                    portfolioItem.companyTicker = companyProfile.ticker;
                    portfolioItem.companyName = companyProfile.name;
                    this.dataLoaded[2 * i] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
            });
            // prettier-ignore
            this._dataLoader.getStockPrice(ticker).subscribe({
                next: (data) => {
                    const stockPrice = data;
                    const stock = stocks[ticker];
                    portfolioItem.quantity = stock.totalQuantity
                    portfolioItem.avgCostPerShare = stock.totalPrice / stock.totalQuantity
                    portfolioItem.totalCost = stock.totalPrice
                    portfolioItem.change =  Math.round(stockPrice.c - stock.totalPrice / stock.totalQuantity)
                    portfolioItem.currentPrice = stockPrice.c
                    portfolioItem.marketValue = stockPrice.c * stock.totalQuantity
                    this.dataLoaded[2 * i + 1] = true;
                    this.showPane = this.dataLoaded.every((elem) => !!elem);
                },
            });
            this.portfolioDisplay.push(portfolioItem);
        });
    }

    public openBuyModal(
        buyModal: any,
        currentPrice: number,
        companyTicker: string
    ) {
        this.modalService.open(buyModal).result.then(
            (result) => {
                const quantity = result;
                const price = quantity * currentPrice;
                const ticker = companyTicker;
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
                this.displayAlert(ticker + ' bought successfully.', 'success');
                this.loadPortfolio();
                this.buyQuantity = 1;
                this.sellQuantity = 1;
            },
            (reason) => {
                this.buyQuantity = 1;
                this.sellQuantity = 1;
            }
        );
    }
    // prettier-ignore
    public openSellModal(sellModal: any, currentPrice: number, companyTicker: string) {
        this.modalService.open(sellModal).result.then(
            (result) => {
                const quantity = result;
                const price = quantity * currentPrice;
                const ticker = companyTicker;
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
                this.displayAlert(ticker + ' sold successfully.', 'danger');
                this.loadPortfolio();
                this.buyQuantity = 1;
                this.sellQuantity = 1;
            },
            (reason) => {
                this.buyQuantity = 1;
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

    public displayAlert(message: string, type: string): void {
        this.alertMessage = message;
        this.alertType = type;
        clearTimeout(this.alertTimeout);
        this.alertTimeout = setTimeout(() => {
            this.alert.close();
        }, 5000);
    }
}
