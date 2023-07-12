export class Tiles {
    constructor() {
        this.$wrap = document.getElementById('wrap');
        this.columns = null;
        this.rows = null;

        this.colors = [
            "#000", "transparent", "#ccc", "violet", "royalblue", "rgb(98,0,234)", "rgb(236,64,122)"
        ];
        this.colorIdx = 0;
        this.limitLeft;
        this.limitRight;
    }//constructor

    init() {
        this.redraw();
        this.add_click_tile();
    }//init

    redraw() {
        this.create_grid();
        this.create_tiles();
    }//redraw

    create_grid() {
        this.columns = Math.floor(document.body.clientWidth / 80);
        this.rows = Math.floor(document.body.clientHeight / 80);

        this.$wrap.style.gridTemplateColumns = `repeat(${this.columns},1fr)`;
        this.$wrap.style.gridTemplateRows = `repeat(${this.rows},1fr)`;
    }//create_grid

    create_tiles() {
        this.$wrap.innerHTML = "";
        this.$$tile = [];

        const quantity = this.columns * this.rows;
        this.limitLeft = (this.columns * this.rows) - this.columns;
        this.limitRight = (this.columns * this.rows) - 1;
        const $frag = document.createDocumentFragment();
        for (let idx = 0; idx < quantity; idx++) {
            const $tile = this.create_tile(idx);
            this.$$tile.push($tile);
            $frag.appendChild($tile);
        }//for
        this.$wrap.appendChild($frag);
    }//create_tiles

    create_tile(idx) {
        const $tile = document.createElement('DIV');
        $tile.classList.add('tile');
        $tile.dataset.index = idx;
        $tile.textContent = idx;
        return $tile
    }//create_tile

    /* ------------------------ */

    add_click_tile() {
        this.$wrap.addEventListener('click', this.on_click_tile, { once: true });
    }//add_click_tile

    on_click_tile = async (e) => {
        if (!e.target.classList.contains('tile')){
            this.add_click_tile();
            return;
        }
        const tileIdx = Number(e.target.dataset.index);
        if (isNaN(tileIdx)) return;
        this.$$tile.forEach(($tile,idx)=>{
            $tile.classList.toggle('on', idx == tileIdx);

        })
        this.checkArr = Array(this.columns * this.rows).fill(null);
        await this.change_tiles(tileIdx);
        this.colorIdx++;
        if(this.colorIdx >= this.colors.length){this.colorIdx = 0;}
        this.add_click_tile();
    }//on_click_tile

    async change_tiles(tileIdx) {
        let count = 1;

        this.tile_color(tileIdx);

        this.leftTop = tileIdx;
        this.leftBottom = tileIdx;
        this.rightTop = tileIdx;
        this.rightBottom = tileIdx;

        this.cacul_tile(tileIdx,count);
        await this.paint_square();


        while(!this.checkArr.every(el => el)){
            count++;
            this.cacul_tile(tileIdx,count);
            await this.paint_square();
        }//while
    }//change_tiles

    paint_square() {

        return new Promise(res => {
            for (let i = this.leftTop; i <= this.leftBottom; i += this.columns) {
                this.tile_color(i);
            }
            for (let i = this.leftTop; i <= this.rightTop; i++) {
                this.tile_color(i);
            }
            for (let i = this.leftBottom; i <= this.rightBottom; i++) {
                this.tile_color(i);
            }
            for (let i = this.rightTop; i <= this.rightBottom; i += this.columns) {
                this.tile_color(i);
            }
            setTimeout(()=>{
                res('...');
            },50);
        });
    }//paint
    
    cacul_tile(tileIdx,count){
        /* leftTop */
        if(this.leftTop > 0){
            if(this.leftTop >= this.columns){
                this.leftTop = tileIdx - (this.columns * count) - count;
            }else{
                this.leftTop--;
            }
        }//
        if(this.leftTop < 0){this.leftTop = 0;}

        /* leftBottom */
        if(this.leftBottom !== this.limitLeft){
            if(!(this.leftBottom % this.columns)){
                //1열일때 
                this.leftBottom += this.columns;
            }else if(this.leftBottom > this.limitLeft){
                //마지막행일때
                this.leftBottom--;
            }else{
                //일반
                this.leftBottom = tileIdx + (this.columns * count) - count;
            }
        }//

        /* rightTop */
        if(this.rightTop !== this.columns - 1){
            if(this.rightTop < this.columns){
                //1행인 경우
                this.rightTop++;
            }else if(!((this.rightTop + 1) % this.columns)){
                //마지막 열인경우
                this.rightTop -= this.columns;
            }else{
                this.rightTop = tileIdx - (this.columns * count) + count;
            }
        }//

        /* rightBottom */
        if(this.rightBottom !== this.limitRight){
            if(!((this.rightBottom + 1) % this.columns)){
                //마지막 열인경우
                this.rightBottom += this.columns;
            }else if(this.rightBottom >= this.limitLeft && this.rightBottom < this.limitRight){
                //마지막 행인경우
                this.rightBottom++;
            }else{
                //그외 
                this.rightBottom = tileIdx + (this.columns * count) + count;
            }
        }//

        console.log(`leftTop:${this.leftTop}\nleftBottom:${this.leftBottom}\n rightTop:${this.rightTop}\nrightBottom:${this.rightBottom}`);
    }//cacul_tile

    tile_color(tileIdx) {
        if(this.checkArr[tileIdx]) return;
        this.checkArr[tileIdx] = true;
        const bgColor = this.colors[this.colorIdx];
        const $tile = this.$$tile[tileIdx];
        if(!$tile)console.error(tileIdx);
        $tile.style.backgroundColor = bgColor;
    }//tile_color

}//class-Tiles