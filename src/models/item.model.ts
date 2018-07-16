export class Item {
    public id: number;

    constructor(
        public nome: string,
        public vlr: number,
        public qtd: number,
        public cod_barras: string,
        public vlr_total: number,
        public foto: Blob,
        public id_lista: number
    ){}
}