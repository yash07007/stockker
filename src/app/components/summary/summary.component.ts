import { Component, Input, OnInit } from '@angular/core';
import { IProfile, IPrice, IHistory } from '../../interfaces/interfaces';
import * as Highcharts from 'highcharts';

declare var require: any;
const noData = require('highcharts/modules/no-data-to-display');
noData(Highcharts);

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
    public data: Array<number[]> = [];
    public Highcharts: typeof Highcharts = Highcharts;

    public chartOptions = {} as any;

    @Input() public companyProfile = {} as IProfile;
    @Input() public stockPrice = {} as IPrice;
    @Input() public stockHistory = {} as IHistory;
    @Input() public companyPeers: string[] = [];

    constructor() {}

    ngOnInit(): void {
        this.chartOptions = {
            chart: {
                type: 'spline',
                height: 400,
            },
            options: {
                lang: {
                    noData: 'No data to display',
                },
            },
            colors: this.getChartColor(),
            title: {
                text: this.companyProfile.ticker + ' Hourly Price Variation',
                style: {
                    color: '#6e6e6e',
                },
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    format: '{value:%H:%M}',
                },
                crosshair: {
                    enabled: true,
                    label: {
                        enabled: true,
                        format: '{value:2f}',
                    },
                },
                dateTimeLabelFormats: {
                    minute: '%h:%m',
                    hour: '%h:%m',
                },
            },
            yAxis: {
                opposite: true,
                title: {
                    text: undefined,
                },
            },
            tooltip: {
                split: true,
                crosshair: true,
            },
            legend: {
                enabled: false,
            },
            series: [
                {
                    name: this.companyProfile.ticker,
                    type: 'spline',
                    data: this.getData(),
                    yAxis: 0,
                    gapSize: 2,
                },
            ],
        };
    }

    public getChartColor(): Highcharts.ColorString[] | undefined {
        const red = '#dc3545';
        const green = '#198754';

        if (this.stockPrice.d < 0) {
            return [red];
        } else if (this.stockPrice.d > 0) {
            return [green];
        } else {
            return undefined;
        }
    }

    public getData(): any {
        if (this.stockHistory && this.stockHistory.t) {
            for (let index = 0; index < this.stockHistory.t.length; index++) {
                const time = this.stockHistory.t[index];
                const price = this.stockHistory.c[index];
                this.data.push([time * 1000 - 7 * 60 * 60 * 1000, price]);
            }
            return this.data;
        } else {
            return [];
        }
    }
}
