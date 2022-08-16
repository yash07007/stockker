import { Component, Input, OnInit } from '@angular/core';
import {
    IEarnings,
    IProfile,
    ISentiments,
    ITrends,
} from '../../interfaces/interfaces';
import * as Highcharts from 'highcharts';

declare var require: any;
const noData = require('highcharts/modules/no-data-to-display');
noData(Highcharts);

@Component({
    selector: 'app-insights',
    templateUrl: './insights.component.html',
    styleUrls: ['./insights.component.css'],
})
export class InsightsComponent implements OnInit {
    public Highcharts: any = Highcharts;

    public chartOptionsEarnings: any = {};
    public chartOptionsTrends: any = {};

    @Input() companySentiments = {} as ISentiments;
    @Input() companyProfile = {} as IProfile;
    @Input() companyTrends = {} as ITrends;
    @Input() companyEarnings = {} as IEarnings;

    constructor() {}

    ngOnInit(): void {}
    ngOnChanges(): void {
        this.chartOptionsEarnings = {
            chart: {
                type: 'spline',
            },
            options: {
                lang: {
                    noData: 'No data to display',
                },
            },
            title: {
                text: 'Historical EPS Surprise',
            },
            xAxis: {
                categories: this.companyEarnings.xcateg,
            },
            yAxis: {
                title: {
                    text: 'Quarterly EPS',
                },
            },
            legend: {
                enabled: true,
            },
            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat: '{point.x}<br>',
            },
            plotOptions: {
                spline: {
                    marker: {
                        enable: false,
                    },
                },
            },
            series: [
                {
                    name: 'Actual',
                    data: this.companyEarnings.actual,
                },
                {
                    name: 'Estimate',
                    data: this.companyEarnings.estimate,
                },
            ],
        };

        let colors = ['#2d473a', '#1d8c54', '#bc8c1d', '#f4585a', '#803131'];
        this.chartOptionsTrends = {
            chart: {
                type: 'column',
            },
            options: {
                lang: {
                    noData: 'No data to display',
                },
            },
            colors: colors,
            title: {
                text: `Recommendation Trends`,
            },
            xAxis: {
                categories: this.companyTrends.xcateg,
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Analysis',
                },
                stackLabels: {
                    enabled: false,
                },
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                backgroundColor:
                    this.Highcharts.defaultOptions.legend.backgroundColor ||
                    'white',
                shadow: false,
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat:
                    '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                    },
                },
            },
            series: [
                {
                    name: 'Strong Buy',
                    data: this.companyTrends.strongBuy,
                },
                {
                    name: 'Buy',
                    data: this.companyTrends.buy,
                },
                {
                    name: 'Hold',
                    data: this.companyTrends.hold,
                },
                {
                    name: 'Sell',
                    data: this.companyTrends.sell,
                },
                {
                    name: 'Strong Sell',
                    data: this.companyTrends.strongSell,
                },
            ],
        };
    }
}
