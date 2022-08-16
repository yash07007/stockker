import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { PortfolioComponent } from '../components/portfolio/portfolio.component';
import { SearchComponent } from '../components/search/search.component';
import { WatchlistComponent } from '../components/watchlist/watchlist.component';

const routes: Routes = [
    { path: '', redirectTo: '/search/home', pathMatch: 'full' },
    { path: 'search/home', component: SearchComponent },
    { path: 'search/:ticker', component: SearchComponent },
    { path: 'watchlist', component: WatchlistComponent },
    { path: 'portfolio', component: PortfolioComponent },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
export const routerComponents = [SearchComponent, WatchlistComponent, PortfolioComponent, PageNotFoundComponent]
