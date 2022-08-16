import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import * as Highcharts from 'Highcharts/highstock';

import HData from 'highcharts/modules/data';
import HExporting from 'highcharts/modules/exporting';

import IndicatorsCore from 'highcharts/indicators/indicators';
import IndicatorZigzag from 'highcharts/indicators/zigzag';

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

HData(Highcharts);
HExporting(Highcharts);

declare var require: any;
var vbp = require('highcharts/indicators/volume-by-price');
vbp(Highcharts);

const noData = require('highcharts/modules/no-data-to-display');
noData(Highcharts);

import { IHistory, IProfile } from 'src/app/interfaces/interfaces';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
    public highcharts = Highcharts;
    public chartOptions: any = {};

    isHighcharts = typeof Highcharts === 'object';
    Highcharts: typeof Highcharts = Highcharts;

    public data = [];

    @Input() companyProfile = {} as IProfile;
    @Input() stockHistory = {} as IHistory;

    public xAxisVals: any = [];

    public updateFlag: boolean = false;
    public routside = true;

    constructor() {}

    ngOnInit(): void {}
    ngOnChanges(): void {
        let ohlc: any = [];
        let volume: any = [];

        if (this.stockHistory) {
            const dataLength = this.stockHistory.t.length;

            for (let i = 0; i < dataLength; i += 1) {
                ohlc.push([
                    this.stockHistory.t[i] * 1000,
                    this.stockHistory.o[i],
                    this.stockHistory.h[i],
                    this.stockHistory.l[i],
                    this.stockHistory.c[i],
                ]);

                volume.push([
                    this.stockHistory.t[i] * 1000,
                    this.stockHistory.v[i],
                ]);
            }

            this.chartOptions = {
                rangeSelector: {
                    allButtonsEnabled: true,
                    enabled: true,
                    inputEnabled: true,
                    selected: 2,
                    dropdown: 'never',
                },
                options: {
                    lang: {
                        noData: 'No data to display',
                    },
                },

                title: {
                    text: this.companyProfile.ticker + ' Historical',
                    align: 'center',
                },

                subtitle: {
                    text: 'With SMA and Volume by Price technical indicators',
                },
                navigator: {
                    enabled: true,
                },
                xAxis: {
                    type: 'datetime',
                },
                legend: {
                    enabled: false,
                },
                yAxis: [
                    {
                        opposite: true,
                        labels: {
                            align: 'center',
                        },
                        title: {
                            text: 'OHLC',
                        },
                        height: '60%',
                        lineWidth: 1,
                    },
                    {
                        opposite: true,
                        labels: {
                            align: 'center',
                        },
                        title: {
                            text: 'Volume',
                        },
                        top: '65%',
                        height: '35%',
                        offset: -1,
                        lineWidth: 1,
                        resize: {
                            enabled: true,
                        },
                    },
                ],

                tooltip: {
                    split: true,
                },

                plotOptions: {},

                series: [
                    {
                        type: 'candlestick',
                        name: this.companyProfile.ticker,
                        id: this.companyProfile.ticker,
                        zIndex: 2,
                        data: ohlc,
                    },
                    {
                        type: 'column',
                        name: 'Volume',
                        id: 'volume',
                        data: volume,
                        yAxis: 1,
                    },
                    {
                        type: 'vbp',
                        linkedTo: this.companyProfile.ticker,
                        params: {
                            volumeSeriesID: 'volume',
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        zoneLines: {
                            enabled: false,
                        },
                    },
                    {
                        type: 'sma',
                        linkedTo: this.companyProfile.ticker,
                        zIndex: 1,
                        marker: {
                            enabled: false,
                        },
                    },
                ],
            };
        }
    }
}
