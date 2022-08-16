export interface IProfile {
    country: string;
    currency: string;
    exchange: string;
    finnhubIndustry: string;
    ipo: string;
    logo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
}

export interface IPrice {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
}

export interface IHistory {
    c: number[];
    h: number[];
    l: number[];
    o: number[];
    s: boolean;
    t: number[];
    v: number[];
}

export interface INewsObj {
    length: number;
    result: INews[];
}

export interface INews {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}

export interface ISearchObj {
    count: number;
    result: ISearch[];
}

export interface ISearch {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
}

export interface ISentiments {
    redditPositiveMention: number;
    redditNegativeMention: number;
    redditMention: number;
    twitterPositiveMention: number;
    twitterNegativeMention: number;
    twitterMention: number;
}

export interface IFavourites {
    companyProfile: IProfile;
    stockPrice: IPrice;
}

export interface IPortfolioItemDisplay {
    companyTicker: string;
    companyName: string;
    quantity: number;
    avgCostPerShare: number;
    totalCost: number;
    change: number;
    currentPrice: number;
    marketValue: number;
}

export interface IEarnings {
    actual: number[][];
    estimate: number[][];
    xcateg: string[];
}

export interface ITrends {
    ticker: string;
    strongBuy: number[];
    buy: number[];
    hold: number[];
    sell: number[];
    strongSell: number[];
    xcateg: string[];
}