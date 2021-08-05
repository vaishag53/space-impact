const mod = 5;
var canv = document.getElementById('canvas');
let ship = document.querySelector('#ship');
window.addEventListener('load',()=>{
    ship.style.position = 'absolute';
    ship.style.top = '200px';
    ship.style.left = '10px';
});
window.addEventListener('keydown',(event)=>{
    switch(event.key)
    {
        case 'ArrowUp':
            if(parseInt(ship.style.top) - mod >= 10)
            {ship.style.top = parseInt(ship.style.top) - mod + 'px'};
            break;
        case 'ArrowDown':
            if(parseInt(ship.style.top) + mod <= 505)
            {ship.style.top = parseInt(ship.style.top) + mod + 'px'};
            break;
        case 'ArrowLeft':
            if(parseInt(ship.style.left) - mod >= 10)
            {ship.style.left = parseInt(ship.style.left) - mod + 'px';}
            break;  
        case 'ArrowRight':
            if(parseInt(ship.style.left) - mod <= 1000)
            {ship.style.left = parseInt(ship.style.left) + mod + 'px';}
            break;
         default:
            if(event.keyCode == 32)
            {shoot();}                      
    }
});

window.addEventListener('animationiteration',()=>{
    canv.r
    
});
var bullets = [];
var bullet_count = 0;
var max_bullet = 20;
function shoot()
{
    if(bullet_count <= max_bullet)
    {
        bullet_count++;
        var laser = document.createElement('div');
        laser.classList.add('laser');
        laser.setAttribute('id','l'+bullet_count)
        laser.style.top = parseInt(ship.style.top) + 45 + 'px';
        laser.style.left = parseInt(ship.style.left)+100+ 'px';
        canv.appendChild(laser);
        //console.log('shoot');
    }
}