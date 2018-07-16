import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, AlertOptions, Loading, AlertController, LoadingController } from 'ionic-angular';
import { ListaService } from '../../providers/lista/lista.service';
import { Item } from '../../models/item.model';


@IonicPage()
@Component({
  selector: 'page-lista-itens',
  templateUrl: 'lista-itens.html',
})
export class ListaItensPage {
  itens: Item[] = [];
  id_lista: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public listaService: ListaService
  ) {
    let lista = this.navParams.get('lista');
    this.id_lista = lista.id;

  }

  ionViewDidLoad() {
    this.listaService.getAllItem(this.id_lista)
      .then((itens: Item[]) => {
        console.log(this.id_lista);
        console.log(itens);
        this.itens = itens;
      });
  }

  onSave(type: string, itemSliding?: ItemSliding, item?: Item): void {
    let title: string = type.charAt(0).toUpperCase() + type.substr(1); //Create
    this.showAlert({
      itemSliding: itemSliding,
      titulo: `${title} item na lista`,
      type: type,
      item: item
    });
  }

  private showAlert(options: { itemSliding?: ItemSliding, titulo: string, type: string, item?: Item }): void {

    let alertOptions: AlertOptions = {
      title: options.titulo,
      inputs: [
        {
          name: 'nome',
          label: 'Item',
          placeholder: 'Nome do item...',
          type: 'text'
        },
        {
          name: 'qtd',
          label: 'Quantidade',
          placeholder: 'Informe a quantidade',
          type: 'number'
        },
        {
          name: 'vlr',
          label: 'Valor',
          placeholder: 'Valor unitário',
          type: 'number'
        }
      ],
      buttons: [
        'Cancelar',
        {
          text: 'Salvar',
          handler: (data) => {

            let loading: Loading = this.showLoading(`Salvando item na lista ${data.nome} ...`);
            let contextItem: Item;

            switch (options.type) {
              case 'adicionar':
                options.type = 'addItem';
                let vlr_total = data.vlr * data.qtd;
                contextItem = new Item(data.nome, data.vlr, data.qtd, '', vlr_total, null, this.id_lista);
                break;

              case 'atualizar':
                options.item.nome = data.titulo;
                contextItem = options.item;
                break;
            }

            this.listaService[options.type](contextItem)
              .then((result: any) => {
                if (options.type === 'addItem') this.itens.unshift(result);
                loading.dismiss();
                if (options.itemSliding) options.itemSliding.close();
              });
          }
        }
      ]
    };
    if (options.type === 'atualizar') {
      alertOptions.inputs[0]['value'] = options.item.nome;
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
