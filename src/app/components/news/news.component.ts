import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    faFacebookSquare,
    faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { INews } from '../../interfaces/interfaces';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
    public faFacebookSquare = faFacebookSquare;
    public faTwitter = faTwitter;

    constructor(private modalService: NgbModal) {}

    ngOnInit(): void {}

    @Input() companyNews = [] as INews[];

    open(content: any) {
        this.modalService
            .open(content, { ariaLabelledBy: 'modal-basic-title' })
            .result.then(
                (result) => {},
                (reason) => {}
            );
    }
}
