import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IncomeComponent } from './components/income/income.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { ExpenseComponent } from './components/expense/expense.component';

import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { ChartComponent } from './components/chart/chart.component';
import { FooterComponent } from './components/footer/footer.component';
import { ServiceWorkerModule } from '@angular/service-worker';

// NgxIndexedDB importálása és konfigurálása
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

// IndexedDB konfiguráció
const dbConfig: DBConfig = {
  name: 'TransactionDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'transactions',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'encryptedData', keypath: 'encryptedData', options: { unique: false } },
        { name: 'type', keypath: 'type', options: { unique: false } },
        { name: 'amount', keypath: 'amount', options: { unique: false } },
        { name: 'name', keypath: 'name', options: { unique: false } }
      ]
    }
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    IncomeComponent,
    DashboardComponent,
    ExpenseComponent,
    ChartComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    FormsModule,
    NgxIndexedDBModule.forRoot(dbConfig), // IndexedDB modul regisztrálása
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'hu-HU' } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeHu);
  }
}
