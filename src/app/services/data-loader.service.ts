import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    IProfile,
    IPrice,
    INewsObj,
    ISearchObj,
    ISentiments,
    IHistory,
    ITrends,
    IEarnings,
} from '../interfaces/interfaces';
//prettier-ignore
@Injectable({
    providedIn: 'root',
})
export class DataLoaderService {
    constructor(private http: HttpClient) {}

    public basurl = 'https://stockker.wl.r.appspot.com';
    // public basurl = 'http://localhost:3000';

    getTickerSearch(query: string): Observable<ISearchObj> {
        const url = this.basurl + '/search/' + query;
        return this.http.get<ISearchObj>(url);
    }

    getCompanyProfile(ticker: string): Observable<IProfile> {
        const url = this.basurl + '/profile/' + ticker;
        return this.http.get<IProfile>(url);
    }

    getStockPrice(ticker: string): Observable<IPrice> {
        const url = this.basurl + '/stock/price/' + ticker;
        return this.http.get<IPrice>(url);
    }

    getStockHistory(ticker: string, from: number, to: number, resolution: string): Observable<IHistory> {
        const url = this.basurl + '/stock/history/' + ticker;
        return this.http.get<IHistory>(url, {params: {from:from, to: to, resolution: resolution}});
    }

    getCompanyNews(ticker: string): Observable<INewsObj> {
        const url = this.basurl + '/news/' + ticker;
        return this.http.get<INewsObj>(url);
    }

    getCompanyPeers(ticker: string): Observable<string[]> {
        const url = this.basurl + '/peers/' + ticker;
        return this.http.get<string[]>(url);
    }

    getCompanySentiments(ticker: string): Observable<ISentiments> {
        const url = this.basurl + '/sentiment/' + ticker;
        return this.http.get<ISentiments>(url);
    }

    getCompanyTrends(ticker: string): Observable<ITrends> {
        const url = this.basurl + '/trends/' + ticker;
        return this.http.get<ITrends>(url);
    }

    getCompanyEarnings(ticker: string): Observable<IEarnings> {
        const url = this.basurl + '/earnings/' + ticker;
        return this.http.get<IEarnings>(url);
    }
}
