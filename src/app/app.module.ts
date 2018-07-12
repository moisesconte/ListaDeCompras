import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SqliteHelperService } from '../providers/sqlite-helper/sqlite-helper.service';
import { ListaService } from '../providers/lista/lista.service';
import { ListaItensPage } from '../pages/lista-itens/lista-itens';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListaItensPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListaItensPage
  ],
  providers: [
    StatusBar,
    SQLite,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SqliteHelperService,
    ListaService
  ]
})
export class AppModule { }
