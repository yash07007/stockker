// Modules
import { AppRoutingModule } from './modules/app-routing.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './modules/angular-material.module';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { SearchPaneComponent } from './components/search-pane/search-pane.component';
import { FooterComponent } from './components/footer/footer.component';
import { SummaryComponent } from './components/summary/summary.component';
import { NewsComponent } from './components/news/news.component';
import { InsightsComponent } from './components/insights/insights.component';
import { ChartsComponent } from './components/charts/charts.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HighchartsChartModule } from 'highcharts-angular';

// Services
import { DataLoaderService } from './services/data-loader.service';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SearchComponent,
        WatchlistComponent,
        PortfolioComponent,
        SearchPaneComponent,
        FooterComponent,
        SummaryComponent,
        NewsComponent,
        InsightsComponent,
        ChartsComponent,
        PageNotFoundComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        HighchartsChartModule,
    ],
    providers: [DataLoaderService],
    bootstrap: [AppComponent],
})
export class AppModule {}
