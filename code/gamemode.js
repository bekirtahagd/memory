let input = document.querySelector('#toggleswitch');
let gamemode = document.querySelector('.gamemode__text');
 
let singleplayer = true;
 
input.addEventListener('change',function(){
    changeMode();
});
 
function changeMode() {
    singleplayer = !singleplayer;
    gamemode.innerText = singleplayer == true ? 'Singleplayer' : 'Multiplayer';
}
 
export function isSingleplayer() {
    return singleplayer;
}