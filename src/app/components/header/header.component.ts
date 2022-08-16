import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    public isMenuCollapsed = true;

    constructor(public state: StateService) {}

    ngOnInit(): void {}

    public getHomeURL(): string {
        const state = this.state.state$.getValue() || {};
        if (state && state.ticker) {
            return '/search/' + state.ticker;
        }
        return '/search/home';
    }
}
