import { Component } from '@angular/core';
import { NavController, Loading, AlertOptions, ItemSliding, AlertController, LoadingController } from 'ionic-angular';
import { Lista } from '../../models/lista.model';
import { ListaService } from '../../providers/lista/lista.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  listas: Lista[] = [];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public listaService: ListaService
  ) {
    this.listaService.getAll()
     .then((listas: Lista[]) => {
     this.listas = listas;
    });
   }

  ionViewDidLoad() {
     this.listaService.getAll()
     .then((listas: Lista[]) => {
     this.listas = listas;
    });
  }

  onSave(type: string, item?: ItemSliding, lista?: Lista): void {
    let title: string = type.charAt(0).toUpperCase() + type.substr(1); //Create
    this.showAlert({
      itemSliding: item,
      titulo: `${title} Lista`,
      type: type,
      lista: lista
    });
  }

  private showAlert(options: { itemSliding?: ItemSliding, titulo: string, type: string, lista?: Lista }): void {

    let alertOptions: AlertOptions = {
      title: options.titulo,
      inputs: [
        {
          name: 'titulo',
          placeholder: 'Titulo da lista'
        }
      ],
      buttons: [
        'Cancelar',
        {
          text: 'Salvar',
          handler: (data) => {

            let loading: Loading = this.showLoading(`Salvando a lista ${data.titulo} ...`);
            let contextLista: Lista;

            switch (options.type) {
              case 'criar':
                contextLista = new Lista(data.titulo);
                break;

              case 'atualizar':
                options.lista.titulo = data.titulo;
                contextLista = options.lista;
                break;
            }

            this.listaService[options.type](contextLista)
              .then((result: any) => {
                if (options.type === 'criar') this.listas.unshift(result);
                loading.dismiss();
                if (options.itemSliding) options.itemSliding.close();
              });
          }
        }
      ]
    };

    if (options.type === 'atualizar') {
      alertOptions.inputs[0]['value'] = options.lista.titulo;
    }

    this.alertCtrl.create(alertOptions).present();
  }

  private showLoading(message?: string): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: message || 'Por favor aguarde...'
    });
    loading.present();
    return loading;
  }

}
