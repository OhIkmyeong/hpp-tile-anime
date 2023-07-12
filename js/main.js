import { Tiles } from "./Tiles.js";

const TILES = new Tiles();
TILES.init();


window.addEventListener('resize',()=>{
    TILES.redraw();
});