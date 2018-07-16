import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Lista } from '../../models/lista.model';
import { SqliteHelperService } from '../sqlite-helper/sqlite-helper.service';
import { Item } from '../../models/item.model';


@Injectable()
export class ListaService {
  private db: SQLiteObject;
  private isFirstCall: boolean = true;

  constructor(public sqliteHelperService: SqliteHelperService) {

  }

  private getDb(): Promise<SQLiteObject> {
    if (this.isFirstCall) {

      this.isFirstCall = false;

      return this.sqliteHelperService.getDb('dadoslista.db')
        .then((db: SQLiteObject) => {

          this.db = db;

          this.db.executeSql('CREATE TABLE IF NOT EXISTS lista (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT)', {})
            .then(success => console.log('Tabela Lista criada com sucesso!', success))
            .catch((error: Error) => console.log('Erro ao criar a tabela Lista!', error));


          this.db.executeSql('CREATE TABLE IF NOT EXISTS itens (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, vlr DOUBLE (15,2),' +
            'qtd DOUBLE (15,2), cod_barras TEXT, vlr_total DOUBLE (15,2), foto BLOB, id_lista INTEGER)', {})
            .then(success => console.log('Tabela itens criada com sucesso!', success))
            .catch((error: Error) => console.log('Erro ao criar a tabela itens!', error));

          return this.db;

        });

    }
    return this.sqliteHelperService.getDb();
  }

  getAll(orderBy?: string): Promise<Lista[]> {

    return this.getDb()
      .then((db: SQLiteObject) => {

        return <Promise<Lista[]>>this.db.executeSql(`SELECT * FROM lista ORDER BY id ${orderBy || 'DESC'}`, {})
          .then(resultSet => {

            //console.log(resultSet);

            let list: Lista[] = [];

            for (let i = 0; i < resultSet.rows.length; i++) {
              list.push(resultSet.rows.item(i));
            }
            //console.log('list, ', list);
            return list;
          }).catch((error: Error) => console.log('Erro na execução do metodo getAll.', error));

      });

  }

  criar(lista: Lista): Promise<Lista> {
    //console.log(lista);
    return this.db.executeSql('INSERT INTO lista (titulo) VALUES (?)', [lista.titulo])
      .then(resultSet => {
        lista.id = resultSet.insertId;
        return lista;
      }).catch((error: Error) => {
        console.log(`Error ao criar a lista '${lista.titulo}'.`, error);
        return Promise.reject(error.message || error);
      });
  }


  atualizar(lista: Lista): Promise<boolean> {
    return this.db.executeSql('UPDATE lista SET titulo=? WHERE id=?', [lista.titulo, lista.id])
      .then(resultSet => resultSet.rowsAffected >= 0)
      .catch((error: Error) => {
        console.log(`Error ao atualizar o nome da lista ${lista.titulo}.`, error);
        return Promise.reject(error.message || error);
      });
  }

  delete(id: number): Promise<boolean> {
    return this.db.executeSql('DELETE FROM lista WHERE id=?', [id])
      .then(resultSet => resultSet.rowsAffected > 0)
      .catch((error: Error) => {
        console.log(`Error ao deletar a lista com o id ${id}.`, error);
        return Promise.reject(error.message || error);
      });
  }

  getById(id: number): Promise<Lista> {
    return this.db.executeSql('SELECT * FROM lista WHERE id=?', [id])
      .then(resultSet => resultSet.rows.item(0))
      .catch((error: Error) => {
        console.log(`Erro ao buscar a lista com id ${id}.`, error);
      });
  }

  addItem(item: Item): Promise<Item> {
    return this.db.executeSql('INSERT INTO itens (nome,vlr,qtd,cod_barras,vlr_total,foto,id_lista) VALUES (?,?,?,?,?,?,?)', [item.nome, item.vlr, item.cod_barras, item.vlr_total, item.foto, item.id_lista])
      .then(resultSet => {
        console.log('additem', resultSet);
        item.id = resultSet.insertId;
        console.log('item', item);
        return item;
      }).catch((error: Error) => {
        console.log(`Error ao adicionar o item '${item.nome}'  a lista de compras.`, error);
        return Promise.reject(error.message || error);
      });
  }

  getAllItem(id_lista: number) {
    return this.getDb()
      .then((db: SQLiteObject) => {

        return <Promise<Item[]>>this.db.executeSql(`SELECT * FROM itens ORDER BY id DESC`, {})
          .then(resultSet => {

            console.log(resultSet);

            let item: Item[] = [];

            for (let i = 0; i < resultSet.rows.length; i++) {
              item.push(resultSet.rows.item(i));
            }
            console.log('list, ', item);
            return item;
          }).catch((error: Error) => console.log('Erro na execução do metodo getAllItem.', error));

      });
  }

}
