import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StateService {
    constructor() {}

    public state$ = new BehaviorSubject<any>(null);
    public error$ = new BehaviorSubject<any>(null);
}
