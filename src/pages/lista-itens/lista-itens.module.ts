import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaItensPage } from './lista-itens';

@NgModule({
  declarations: [
    ListaItensPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaItensPage),
  ],
})
export class ListaItensPageModule {}
