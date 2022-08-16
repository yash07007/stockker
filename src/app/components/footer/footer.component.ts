import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="footer">
            Powered by&nbsp;<a
                href="https://finnhub.io"
                target="_blank"
                class="text-primary text-decoration-none"
                >Finnhub.io</a
            >
        </div>
    `,
    styles: [
        `
            .footer {
                height: 35px;
                width: 100%;
                background-color: lightgray;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        `,
    ],
})
export class FooterComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
