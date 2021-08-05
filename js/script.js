//to render in canvas
const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');
canv.width = innerWidth;
canv.height = innerHeight-10;

//Audio files
const bgMusic = new Audio('aud/bg-music.mp3');
bgMusic.volume = 0.5;
const shootAudio = new Audio('aud/laser-1.wav');
const alienHit = new Audio('aud/al1-hit.mp3');
const enemyShoot = new Audio('aud/laser-2.mp3');
enemyShoot.volume = 0.2;
const overAudio = new Audio('aud/game-over.wav');
const playerHit = new Audio('aud/player-hit.mp3');
const bigLaserAud = new Audio('aud/big-laser.mp3');
const empty = new Audio('aud/empty.mp3');
const bombFireAud = new Audio('aud/bomb-0.mp3');
const bombExplode = new Audio('aud/bomb-1.mp3');
const charging = new Audio('aud/charging.mp3');
charging.volume = 0.5;
const charged = new Audio('aud/charged.mp3');
charged.volume = 0.3;
const fuelEmpty = new Audio('aud/fuelEmpty.m4a');
const rewindAud = new Audio('aud/rewind.mp3');
rewindAud.volume = 0.2;
const refuelingAudio = new Audio('aud/refueling.m4a');



//To change the score and abilities and coins
const scoreEle = document.getElementById('score');
const shieldEle = document.getElementById('shield');
const beamEle = document.getElementById('beam');
const invisibleEle = document.getElementById('invisible');
const freezeEle = document.getElementById('freeze');
const bombEle = document.getElementById('bomb');
const coinEle = document.getElementById('coin');
const progressEle = document.getElementById('progress');
const skillEle = document.getElementById('skills');
const skillPointEle = document.getElementById('skillPoints');
const skillAcquiredEle = document.getElementById('skillAcquired');
const fuelEle = document.getElementById('fuel');
const fueling = document.getElementById('fueling');
fueling.vedioWidth = canv.width;
fueling.vedioHeight = canv.height;
fueling.volume = 1;

//after game over
const overEle = document.getElementById('over');
const finalScoreEle = document.getElementById('finalScore');
const finalCoinEle = document.getElementById('finalCoin');

let beamCount;
let shieldCount;
let freezeCount;
let invisibleCount;
let bombCount;
let score;
let totalCoins;
let progressLimit;
let progressValue;
let skillPoint;
let shieldTime;
let freezeTime;
let invisibleTime;
let reverseEnabled;
let reverseTime;
let coinUpgrade;
let fuelConsumption;

//To change the player life
const lifeEle = document.getElementById('life');
let life;

let animationId;
let skillFrame = false;
let player;
let ability;
let fuelStation;
let boss;
const mod = 15;
let bullets;
let enemy_bullets;
let enemies;
const aliens = ['imgs/al-1.png','imgs/al-2.png'];
const alien_ship = ['imgs/al-ship-1.png','imgs/al-ship-1.png'];
const abilitiesImg = ['imgs/abil-1.png','imgs/abil-2.png','imgs/abil-3.png','imgs/abil-4.png','imgs/nuke.png'];
const abilityType = ['shieldCount','beamCount','invisibleCount','freezeCount','bombCount'];
let heart;
let shield;
let shieldAbility;
let bigLaser;
let particles = [];
let coins;
let freeze = false;
let doubleBullet;
let bulletColor;
let abilityTime;
let reactor;
let reactorEnable;
let t1,t2;
let fuel;
let gameOvered = false;
let rewindData;
let reversing = false


//For creating players
class  Ship{
    constructor(x,y,src,height,width){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.canHit = true;
        this.img = new Image();
        this.img.src = src;
        this.engine = new Image();
        this.ability1 = 0;
        this.visible = true;
        this.engine.src = 'imgs/engine.gif';
    }
    draw()
    {
        this.img.onload = ()=>{ 
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
            ctx.drawImage(this.engine,this.x,this.y,2,2);
        };
    }
    update()
    {
        ctx.drawImage(this.engine,this.x+10,this.y+30,20,20);
        ctx.drawImage(this.engine,this.x,this.y+40,20,20);
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
    hit()
    {
        ctx.save();
        ctx.globalAlpha = 0.5;
        player.update();
        ctx.restore();
    }
    bottom() { return this.y + this.height; }
    left() { return this.x; }
    right() { return this.x + this.width; }
    top() { return this.y; }
}
//For creating abilities
class Abilities extends Ship{
    constructor(x,y,src,height,width,v,type)
    {
        super(x,y,src,height,width);
        this.v = v;
        this.type = type;
    }
    draw()
    {
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
    update()
    {
        this.x = this.x - this.v.x;
        this.draw();
    }
}

//For creating enemies ship
class Enemy extends Ship{
    constructor(x,y,src,height,width,v,type,hitPoint)
    {
        super(x,y,src,height,width);
        this.v = v;
        this.type = type;
        this.backWard = false;
        this.hitPoint = hitPoint;
        if(type == 'ship' || type == "boss" || type == "al-2")
        {    
            this.canShoot = true;
            //console.log("shootable added");
        }
    }
    shoot()
    {
        if(this.canShoot)
        {
            enemy_bullets.push(new Bullet(this.x-10,this.y+40,10,3,'green',{x:-5,y:0}));
            alienBulletAud.push(enemyShoot.cloneNode());
           enemyShoot.play();
            if(this.type == 'ship' || this.type == 'boss')
            {
             setTimeout(()=>{
                 enemy_bullets.push(new Bullet(this.x-10,this.y,10,3,'green',{x:-5,y:0}));
                 if(this.type == 'boss')
                    enemy_bullets.push(new Bullet(this.x-10,this.y+50,10,3,'green',{x:-5,y:0}));
                 //enemyShoot.play();
             },1000);
            }
            console.log("Shooted");
        }

    }
    draw()
    {
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
    update()
    {
        if(this.type == 'ship' || this.type == 'boss')
        {
            if(this.x < 300 && !this.backWard )
            {
                //this.x  = this.x + this.v.x;
                this.backWard = true;
            }
            else if(this.x >= canv.width - 50 && this.backWard)
            {
                //this.x = this.x - this.v.x;
                this.backWard = false;
            }
            else if(!this.backWard)
            {
                this.x = this.x - this.v.x;
            }
            else
            {
                this.x = this.x + this.v.x;
            }          
        }
        else
        {
            this.x = this.x - this.v.x;
        }
        this.draw();
    }
}

//For creating bullets
class Bullet{
    constructor(x,y,height,width,color,v){
        this.x = x;
        this.y = y;
        this.color = color;
        this.v = v;
        this.height = height;
        this.width = width;
    }
    draw()
    {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = this.color;
        //ctx.strokeStyle = 'rgba(255,165,0,0.1)'
        ctx.strokeRect(this.x,this.y,this.height,this.width);
        ctx.moveTo(this.x-1,this.y,this.height,this.width-2);
        ctx.lineTo(this.x-1,this.y,this.height,this.width-2);
        ctx.stroke();
        //console.log("bullet");
    }
    update()
    {
        this.draw();
        this.x = this.x + this.v.x ;
        this.y = this.y + this.v.y; 
    }
    bottom() { return this.y + this.height; }
    left() { return this.x; }
    right() { return this.x + this.width; }
    top() { return this.y; }
}
class BigLaser extends Bullet{
    draw()
    {
        ctx.beginPath();
        // ctx.lineWidth = "3";
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.fill();
    }
}
class Bomb extends Bullet{
    constructor(x,y,height,width,color,v)
    {
        super(x,y,height,width,color,v);
        this.img = new Image();
        this.img.src = 'imgs/nuke.png';
        this.engine = new Image();
        this.engine.src = 'imgs/engine.gif';
        this.alpha = 1;
    }
    draw()
    {
        this.img.onload = ()=>{
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        };
        ctx.drawImage(this.engine,this.x-10,this.y+15,20,20);
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        //console.log("draw");
    }
    explode()
    {
        if(this.height >= 150)
            this.img.src = 'imgs/bomb-1.png';
        else
            this.img.src = 'imgs/bomb-2.png';
        this.engine.src = "";
        this.v.x = 0;
        this.y -= 5
        this.height += 10;
        this.width += 10;
        this.alpha -= 0.01;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        this.draw();
        //console.log('calling draw');
        ctx.restore();
        //setInterval(this.explode,0);
    }
}
const frict = 0.99;
class Particles{
    constructor(x,y,r,color,v){
        this.x = x;
        this.y = y;
        this.color = color;
        this.v = v;
        this.r = r;
        this.alpha = 1;
        //console.log(this.color);
    }
    draw()
    {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,Math.PI *2,false);
        //ctx.fillStyle = 'orange';
        ctx.fillStyle = this.color;
        ctx.fill();
        // ctx.fillStyle = 'rgba(0,0,0,0.1)';
        // ctx.fillRect(this.x,this.y,this.r,this.r);
        ctx.restore();  
        // console.log(ctx.fillStyle)
    }
    update()
    {
        this.draw();
        this.v.x *= frict;
        this.v.y *= frict;
        this.alpha = this.alpha - 0.01;  
        this.x = this.x + this.v.x ;
        this.y = this.y + this.v.y; 
    }
}


class Shield
{
    draw()
    {
        ctx.beginPath();
        ctx.strokeStyle = 'skyblue';
        ctx.lineWidth = '2';
        //ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        ctx.arc(this.x,this.y,this.r,this.s,this.e);
        ctx.stroke(); 
    }
    update()
    {
        this.x = player.x + player.width/2 -20;
        this.y = player.y + player.height / 2;
        this.r = player.height  ;
        this.s = Math.PI * 1.5;
        this.e = Math.PI * 0.5;
        this.draw();
    }
    bottom() { return this.y + this.r; }
    left() { return this.x; }
    right() { return this.x + this.r; }
    top() { return this.y; }
    
}

//to spawn basic aliens randomly from end
function spawnAl1()
{
    al1Id = setInterval(()=>{
        const x = canv.width;
        let y = Math.random() * canv.height;
        if(y >= canv.height-80)
            y = y - 100;
        const src = aliens[1];
        const v = {
            x:5,
            y:0
        };
        if(!freeze && !reversing)
            enemies.push(new Enemy(x,y,src,80,80,v,'al-1',2));
        //console.log(enemies);
    },3000);
}

//to spawn shootable aliens
function spawnAl2()
{
    al2Id = setInterval(()=>{
        const x = canv.width;
        let y = Math.random() * canv.height;
        if(y >= canv.height-80)
            y = y - 100;
        const src = aliens[0];

        const v = {
            x:2,
            y:0
        };
        if(!freeze && !reversing)
            enemies.push(new Enemy(x,y,src,80,80,v,'al-2',4));
        //console.log(enemies);
    },5000);
}
//to spawn alien ship from end
function spawnAliensShip()
{
    shipId = setInterval(()=>{
        const x = canv.width;
        let y = Math.random() * canv.height;
        if(y >= canv.height-80)
            y = y - 100;
        const src = alien_ship[parseInt(Math.random() * alien_ship.length)];
        const v = {
            x:3,
            y:0
        };
        if(!freeze && !reversing)
            enemies.push(new Enemy(x,y,src,80,80,v,'ship',5));
        //console.log(enemies);
    },10000);
}

function spawnBoss()
{
    let i = setInterval(()=>{},0);
    for(j = 0;j <= i;j++)
        clearInterval(j);
    boss = new Enemy(canv.width,canv.height/2,'imgs/boss.png',200,200,{x:1,y:0},'boss',50);
    enemies.push(boss);
    alien_shoot();
}
function alien_shoot()
{
    setInterval(()=>{
        enemies.forEach((enemy)=>{
            if(!freeze && !reversing)
            {
                enemy.shoot();
            }
            alienBulletAud.forEach( (aud,idx) => {
            aud.play();
            alienBulletAud.splice(idx,1);
            });
        });
    },5000);
}
//to spawn abilities and extra life
function spawnHeart()
{
   setTimeout(()=>{
    const x = canv.width;
    let y = Math.random() * canv.height;
    if(y >= canv.height-80)
        y = y - 100;
    const src = 'imgs/heart.gif';
    const v = {
        x:3,
        y:0
    };
    heart = new Abilities(x,y,src,40,40,v,'life');
    },20000);
}
function spawnShield()
{
    setInterval(()=>{
        const x = canv.width;
        let y = Math.random() * canv.height;
        if(y >= canv.height-80)
            y = y - 100;
        const src = 'imgs/abil-1.png';
        const v = {
            x:3,
            y:0
        };
        shieldAbility = new Abilities(x,y,src,40,40,v,'shield');
        },20000);
}
//to refuel the station
function spawnFuelStation()
{
    fuelStation = new Abilities(canv.width,canv.height-200,'imgs/fuel-ship.png',100,100,{x:1},'fuel');
    coins.push(fuelStation);
}
function refuel()
{
    fueling.play();
    freeze = true;
    fuel = 100;
    refuelingAudio.play();
    cancelAnimationFrame(animationId);
    let i = setInterval(()=>{
        if(freeze == true)
            ctx.drawImage(fueling,0,0);
        if(fueling.ended)
        {            
            freeze = false;
            startGame();
            clearInterval(i);          
        }
    },1000/60);
    //setTimeout(()=>
    // if(fueling.ended){
    //     clearInterval(i);
    //     startGame();
    //     freeze = false;
    //},000);
}
//To store the data for reverse
let j=0;
function backUp()
{
    if(reverseTime == 1)
        n = 10;
    else 
        n = 15;
    let d = {
        'beamCount':beamCount,
        'shieldCount':shieldCount,
        'freezeCount':freezeCount,
        'invisibleCount':invisibleCount,
        'bombCount':bombCount,
        'fuel':fuel,
        'life':life
    }
    // console.log(j,rewindData.length);
    j += 1;
    if(j >= n)
        rewindData.shift();
    rewindData.push(d);
    
}
function rewind()
{
    let d = rewindData.shift();
    beamCount = d['beamCount'];
    shieldCount = d['shieldCount'];
    freezeCount = d['freezeCount'];
    invisibleCount = d['invisibleCount'];
    bombCount = d['bombCount'];
    fuel = d['fuel'];
    life = d['life'];
    let s = '';
    for(i = 1;i <= life;i++)
        s += '<span id="'+i+'">&hearts;</span>';
    lifeEle.innerHTML = s;
    console.log('changed');
    fuel -= 30* fuelConsumption;
    
    enemies.forEach((enemy)=>{
        enemy.v.x *= -1;
    });
    enemy_bullets.forEach((bullet)=>{
        bullet.v.x *= -1;
    })
    setTimeout(()=>{
        enemies.forEach((enemy)=>{
            enemy.v.x *= -1;
        });
        enemy_bullets.forEach((bullet)=>{
            bullet.v.x *= -1;
        })
        reversing = false;
    },n/2 *1000);
}
let limit;
//To spawn random abilities
function spawnAbility()
{
    setInterval(()=>{
        var i = parseInt(Math.random() * abilitiesImg.length);
        const x = canv.width;
        let y = Math.random() * canv.height;
        if(y >= canv.height-80)
            y = y - 100;
        const src = abilitiesImg[i];
        const v = {
            x:3,
            y:0
        };
        if(ability == undefined || ability.x <= 0)
        ability = new Abilities(x,y,src,40,40,v,abilityType[i]);
       },10000); 
}
function explosion(type,obj)
{
    var n;
    if(type == 'bullet')
        n = 5;
    else if(type == 'enemy')
        n = 12;
    for(i = 0;i < n;i++)
    {
        particles.push(new Particles(obj.left(),obj.y+5,
                        Math.random() * 2,
                        particleColors[parseInt(Math.random() * particleColors.length)],{
                        x:(Math.random() - 0.5) * (Math.random() * 8)  ,
                        y:(Math.random() - 0.5) * (Math.random() * 8)
            }));
        }
}
//to shoot playerBullet
function shoot()
{
    bullets.push(new Bullet(player.x+100,player.y+40,10,3,bulletColor,{x:15,y:0}));
    if(doubleBullet == 'true')
    {
        setTimeout( ()=>{
            bullets.push(new Bullet(player.x+100,player.y+40,10,3,bulletColor,{x:15,y:0}));
            },100); 
    }
    //shipBulletAud.push(shootAudio.cloneNode());
    shipBulletAud.forEach( (aud,idx) =>{
    aud.play();
    shipBulletAud.splice(idx,1);
    });
}

let shipBulletAud = [];
let alienHitAud = [];
let alienBulletAud = [];
let playerHitAud = [];
const particleColors = ['rgb(255,165,0)','rgb(255,140,0)','rgb(255,215,0)','rgb(255,99,71)'];

//To detect player inputs
// let i = 0;
// const bulletType = ['red','blue','yellow'];
// addEventListener('wheel',()=>{
//     console.log('called');
//     bulletColor = bulletType[i++];
//     if(i > 2)
//         i = 0;
// });
addEventListener('keydown',(event)=>{  
    switch(event.key)
    {
        case 'ArrowUp':
            //event.preventDefault();
            if(player.y - mod > 0)
            player.y -= mod;
            //console.log('up');
            break;
        case 'ArrowDown':
            //event.preventDefault();
            if(player.y + mod <= canv.height-100)
            player.y += mod;
            break;
        case 'ArrowLeft':
            //event.preventDefault();
            if(player.x - mod > 0)
            player.x -= mod;
            break;
        case 'ArrowRight':
            //event.preventDefault();
            if(player.x + mod < canv.width-100)
            player.x += mod;
            break;
        case 'e':
            if(beamCount > 0)
            {    
                bullets.push(new BigLaser(player.x,0,canv.height,3,'blue',{x:10,y:0}));
                bigLaserAud.play();
                beamCount -= 1;
            }
            else
                empty.play();
            break;
        case 's':
            if(shieldCount > 0)
            {    
               // setTimeout( () => {
                    player.canHit = false;
               // },0);
                setTimeout( () => {
                    player.canHit = true;
                },shieldTime);
                shieldCount -= 1;
            }
            else
                empty.play();
            break;
        case 'f':
            if(freezeCount > 0)
            {    
               // setTimeout( () => {
                    freeze = true;
                //},0);
                setTimeout( () => {
                    freeze = false;
                },freezeTime);
                freezeCount -= 1;
            }
            else
                empty.play();
            break;
        case 'i':
            if(invisibleCount > 0)
            {    
              //  setTimeout( () => {
                    player.visible = false;
               // },0);
                setTimeout( () => {
                    player.visible = true;
                },invisibleTime);
                invisibleCount -= 1;
            }
            else
                empty.play();
            break;
        case 'b':
            if(bombCount > 0)
            {    
                bullets.push(new Bomb(player.x+100,player.y+20,50,70,'bomb',{x:5,y:0}));
                bombCount -= 1;
                bombFireAud.play();
                //bombExplode.play();
            }
            else
                empty.play();
            break; 
        case 'r':
            if(reverseEnabled)
            {
                if(fuel > 0)
                {
                    reversing = true;
                    rewindAud.play();
                    rewind();  
                }
                else
                    fuelEmpty.play();
            }    
            break;
        case 'Tab':
            event.preventDefault();
            if(!skillFrame)
            {
                cancelAnimationFrame(animationId);
                skillEle.style.display = 'block';
                skillFrame = true;
            }
            else
            {
                if(!gameOvered)
                    startGame();
                skillEle.style.display = 'none';
                skillFrame = false;
            }
            skillEle.classList.toggle('show');
            if(!freeze)
                freeze = true;
            else
                freeze = false;
            break;
        default:
            if(event.keyCode == 49)
                //console.log('called');
                bulletColor = 'red';
            else if(event.keyCode == 50)
                bulletColor = 'yellow';
            else if(event.keyCode == 51)
                bulletColor = 'blue'
            else if(event.keyCode == 32)
            {
                if(!reactorEnable)
                {
                    shoot();
                }
                else
                {
                    t1 = new Date();
                    if(reactor == undefined)
                        reactor = new Abilities(player.x+100,player.y+30,'imgs/abil-1.png',0,0,{x:0},'reactor');
                    if(reactor.height == 0)
                    {
                        reactor.y = player.y+30;
                        reactor.x = player.x+100;
                    }
                        
                    if(reactor.height >= 300)
                    {
                        reactor.v.x = -5;
                        bullets.push(reactor);
                        reactor = undefined;
                        reactorEnable = false;
                    }  
                    if(reactorEnable)    
                    {    //reactor.y = player.y;
                        if(fuel >= 0)
                        {   
                            fuel -= fuelConsumption;
                            reactor.height += 10;
                            reactor.width += 10;
                            reactor.y -= 5
                            charging.play();
                        }
                        else 
                        {
                            reactor.v.x = -5;
                            bullets.push(reactor);
                            reactor = undefined;
                            reactorEnable = false;
                        }
                    }
                }
                //console.log(t1.getSeconds());
            }
    }  
});
   
addEventListener('keyup',(event) => {
    if(event.keyCode ==  32)
    {
        t2 = new  Date();
        //console.log(t2 - t1);   
        if(Math.abs(t2 - t1) <= 50)
        {
            //console.log('launch');
            reactor.v.x = -5;
            bullets.push(reactor);
            //console.log(reactor);
            //console.log("falsed");
            reactorEnable = false; 
        }
        else
        {
            charging.pause();
            if(reactor != undefined && reactorEnable)
            {
                //console.log(reactor.height/fuelConsumption)
                fuel += reactor.height/10 * fuelConsumption;
                reactor.height = 0;
                reactor.width = 0;
                reactor.y = player.y+40; 
            }
            if(reactorEnable)
                shoot();
        }
    }
});
//will call itself for rendering
function startGame()
{
    animationId = requestAnimationFrame(startGame);
    ctx.clearRect(0,0,canv.width,canv.height);
    beamEle.innerHTML = beamCount;
    shieldEle.innerHTML = shieldCount;
    freezeEle.innerHTML = freezeCount;
    invisibleEle.innerHTML = invisibleCount;
    bombEle.innerHTML = bombCount;
    coinEle.innerHTML = totalCoins;
    progressEle.setAttribute('value',progressValue);
    fuelEle.setAttribute('value',fuel);
    //boss.update();
    //to check if the progress meter is full or not
    if(progressValue >= progressLimit)
    {
        abilityTime += 1000;
        charged.play();
        //console.log("in")
        reactorEnable = true;
        //console.log(reactorEnable);
        skillPoint += 1;
        progressLimit *= 2;
        progressValue = 0;
        skillAcquiredEle.classList.add('show');
        skillAcquiredEle.style.display = 'block';
        setTimeout(()=>{
            skillAcquiredEle.style.display = 'none';
            skillAcquiredEle.classList.remove('show');           
        },1000);
        skillPointEle.innerHTML= skillPoint; 
        progressEle.setAttribute('value',progressValue);
        progressEle.setAttribute('max',progressLimit);
    }
    //to spawn boss
    if(score > 100 && boss == undefined) 
        spawnBoss();
    if(score > 100 && enemies.length == 0)
    {
        setTimeout(gameOver,3000);
    }
        
    if(score > limit)
    {
        spawnFuelStation();
    }
    if(reactor != undefined)
    {
        reactor.update();
        if(reactor.x >= canv.width)
            reactor = undefined;
    }
    if(player.canHit && player.visible)
        player.update();
    else 
    {
        if(!player.canHit)
            shield.update();
        player.hit();
    }
    if(typeof ability != 'undefined' && score > limit)
    {
        if(!freeze)
            ability.update();
        else
            ability.draw();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    if(life == 1 && typeof heart != 'undefined')
    {
        if(!freeze)
            heart.update();
        else
            heart.draw();
    }
    //To get additional life
    if(typeof heart != 'undefined')
    {
        if((player.right()-20 > heart.left() && player.bottom() -20 > heart.top() && player.top() < heart.bottom() && player.left() < heart.right()))
        {
            lifeEle.innerHTML='<span id="1">&hearts;</span><span id="2">&hearts;</span>';
            life = 2;
            heart = undefined;
        }
    }
    coins.forEach( (coin,idx) => {
        if(!freeze)
            coin.update();
        else
            coin.draw();
        if((player.right()-20 > coin.left() && player.bottom() -20 > coin.top() && player.top() < coin.bottom() && player.left() < coin.right()))
        {
            if(coin.type == 'fuel')
                refuel();
            else
                totalCoins += coin.v.value;
            coins.splice(idx,1);
            // console.log(totalCoins);
        }
        if(coin.x < 0)
            coins.splice(idx,1);
    });
    //To get abilities
    if(typeof ability != 'undefined')
    {
        if((player.right()-20 > ability.left() && player.bottom() -20 > ability.top() && player.top() < ability.bottom() && player.left() < ability.right()))
        {
            limit += 500;
            eval(ability.type + '+=1');
            // switch(ability.type)
            // {
            //     case 'shield':
            //         shieldCount += 1;
            //         // setTimeout( () => {
            //         //     player.canHit = false;
            //         // },0);
            //         // setTimeout( () => {
            //         //     player.canHit = true;
            //         // },5000);
            //         break;
            //     case 'beam':
            //         beamCount += 1;
            //         break;
            //     case 'invisible':
            //         invisibleCount += 1;
            //         // setTimeout( () => {
            //         //     player.visible = false;
            //         // },0);
            //         // setTimeout( () => {
            //         //     player.visible = true;
            //         // },5000);
            //         break;
            //     case 'freeze':
            //         freezeCount += 1;
            //         // setTimeout( () => {
            //         //     freeze = true;
            //         // },0);
            //         // setTimeout( () => {
            //         //     freeze = false;
            //         // },5000);
            //         break;
            //     case 'bomb':
            //         bombCount += 1;
            //         break;
            // }
            // abilityCount += 1;
            // limit += 500;
            ability = undefined;
        }
    }

    particles.forEach( (particle,idx) => {
        if(particle.alpha <= 0)
            particles.splice(idx,1);
        else
        {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            particle.update();
            ctx.fillRect(particle.x,particle.y,particle.r,particle.r);
            ctx.restore();
        }
    });
    enemy_bullets.forEach( (bullet,idx) =>
    {
        if(!freeze)
            bullet.update();
        else
            bullet.draw();
        //To check if a bullets hit on shield
        if(!player.canHit && (shield.right()> bullet.left() && shield.bottom() > bullet.top() && shield.top() < bullet.bottom() && shield.left() < bullet.right()))
        {
            explosion('bullet',bullet);
            enemy_bullets.splice(idx,1);
        }
        //To check if a enemy bullets hits player
        else if(player.visible && (player.right()-20 > bullet.left() && player.bottom() -20 > bullet.top() && player.top() < bullet.bottom() && player.left() < bullet.right()))
        {
            if(life > 1 && player.canHit)
            {
                playerHit.play();
                setTimeout(() =>{
                    try{
                       document.getElementById(life+"").remove();
                        player.canHit = false;
                        enemy_bullets.splice(idx,1);
                        life = life - 1;
                   }
                   catch(err)
                   {
                       gameOver();
                   }
                } ,0); 
                setTimeout( () =>{
                   player.canHit = true ;
                },5000);
            }
            else if(player.canHit)
            {
                gameOver();
            }
            //console.log('collision');
            //to check if a player bullet hits an enemy bullets
        }
        bullets.forEach( (pbullet,pi) => {
            //if((pbullet.right()-20 > bullet.left() && pbullet.bottom() -20 > bullet.top() && pbullet.top() < bullet.bottom() && pbullet.left() < bullet.right()))
            if(pbullet.right() >= bullet.left() && (pbullet.bottom() > bullet.top() && pbullet.top() < bullet.bottom()))
            {
                explosion('bullet',bullet);
                if(! (pbullet instanceof BigLaser || pbullet instanceof Bomb  || pbullet instanceof Abilities))
                {
                    bullets.splice(pi,1);
                    //console.log(typeof bullet);
                   // console.log("removed");
                }
                //console.log(pbullet instanceof BigLaser);
                enemy_bullets.splice(idx,1);
            } 
        });
        //To remove bullets after reaching edge
        if(bullet.x < 0)
        {
            enemy_bullets.splice(idx,1);
        }
    });
    bullets.forEach( (bullet,idx) =>
    {
        
        if(bullet.color == 'bomb' && bullet.x >= canv.width/2)
        {
            //explosion('bullet',bullet);
            bombExplode.play();
            bullet.explode();
           // bullets.splice(idx,1);
        }
        else
            bullet.update();
        //To remove bullets after reaching edge
        if(bullet.x > canv.width || bullet.right() > canv.width+100)
        {
            bullets.splice(idx,1);
        }

    });
    enemies.forEach((enemy,ei) => {
        if(!freeze)
            enemy.update();
        else
            enemy.draw();
        //if(player.right() >= enemy.left() && (player.bottom() > enemy.top() && player.top() < enemy.bottom())) 
        // if(//player.right() >= enemy.left() || 
        // (player.bottom() > enemy.top() && player.right() >= enemy.left())
        //  || (player.top() < enemy.bottom() && player.right() >= enemy.left()))

        //To check if an enemy hit on shield
        if(!player.canHit && (shield.right() > enemy.left() && shield.bottom() > enemy.top() && shield.top() < enemy.bottom() && shield.left() < enemy.right()))
        {
            explosion('enemy',enemy);
            enemies.splice(ei,1);
        }
        //To check if a player hits a enemy
       else if(player.visible && (player.right()-20 > enemy.left() && player.bottom() -20 > enemy.top() && player.top() < enemy.bottom() && player.left() < enemy.right()))
        {

            if(life > 1 && player.canHit)
            {
                playerHit.play();
                setTimeout(() =>{
                    try{
                        document.getElementById(life+"").remove();
                        player.canHit = false;
                        life = life - 1;
                   }
                   catch(err)
                   {
                       gameOver();
                   }
                    enemies.splice(ei,1);
                } ,0); 
                setTimeout( () =>{
                   player.canHit = true ;
                },5000);
            }
            else if(player.canHit)
            {
                gameOver();
            }
            //console.log('collision');
        }

        //To remove enemies after reaching edge
        if(enemy.x < 0)
        {
            enemies.splice(ei,1);
        }

        //To detect if a player bullets hits an enemy and remove that enemy
        bullets.forEach((bullet,bi) =>{
            //var dist = Math.hypot(bullet.x - enemy.x,bullet.y - enemy.y);
            //if(dist - enemy.width /2- enemy.height < 1)
            //console.log(bullet.right(),enemy.left());
            //bullet.top() > enemy.bottom() ||
            //bullet.bottom() > enemy.top())
            if(bullet.right() > enemy.left() && bullet.bottom() > enemy.top() && bullet.top() < enemy.bottom() && bullet.left() < enemy.right())
            //if(bullet.right() >= enemy.left() && (bullet.bottom() > enemy.top() && bullet.top() < enemy.bottom())) 
            {
                // console.log("removed");
                // console.log(enemy.y,enemy.x);
                // console.log(bullet.y,bullet.x);
                // console.log(dist-enemy.width/2);
                if(bulletColor == 'blue' && enemy.type == 'ship')
                    enemy.hitPoint -= 2;
                else if(bulletColor == 'yellow' && enemy.type == 'al-2')
                    enemy.hitPoint -= 2;
                else 
                    enemy.hitPoint -= 1;
                //To add explosion
                explosion('enemy',enemy);
                alienHitAud.push(alienHit.cloneNode());
                alienHitAud.forEach((aud,idx) => {
                    aud.play();
                    alienHitAud.splice(idx,1);
                });
                scoreEle.innerHTML = score;
                setTimeout(()=>{
                    if(enemy.hitPoint <= 0)
                    {
                        enemies.splice(ei,1);
                        var coinValue = 0;
                        var height;
                        switch(enemy.type)
                        {
                            case 'al-1':
                                score += 10;
                                progressValue += 1;
                                height = 25;
                                coinValue = 50;
                                break;
                            case 'al-2':
                                score += 20;
                                progressValue += 2;
                                height = 30;
                                coinValue = 100;
                                break;
                            case 'ship':
                                score += 30;
                                progressValue += 3;
                                height = 50;
                                coinValue = 200;
                                break;
                            case 'boss':
                                score += 100;
                                progressValue += 8;
                                height = 60;
                                coinValue = 500;
                        }
                        coinValue += parseInt(coinValue * coinUpgrade/1000);
                        coins.push(new Abilities(enemy.x,enemy.y,'imgs/coin.png',height,height,{x:3,value:coinValue},'coin'));
                    }
                    if(! ((bullet instanceof BigLaser || bullet instanceof Bomb || bullet instanceof Abilities))) //&& enemy.type != 'boss'))
                    {
                        //console.log(typeof bullet);
                        //console.log(bullet instanceof BigLaser);
                        bullets.splice(bi,1);
                    }
                    
                },0);
            }
        });   
    });  
}
let data = JSON.parse(sessionStorage.getItem('data'));
function gameOver()
{
    try{
        lifeEle.removeChild(lifeEle.firstElementChild);
    }
    catch(err){
        console.log(err);
    }
    gameOvered = true;
    canv.style.animationPlayState = 'paused';
    skillAcquiredEle.style.display = 'none';
    cancelAnimationFrame(animationId);
    overEle.style.display = 'block';
    overEle.classList.add('show');
    finalScoreEle.innerHTML = score;
    finalCoinEle.innerHTML = totalCoins;
    overAudio.play();
    let closeId = setInterval(()=>{},10000);
    for(i = 1;i <= closeId; i++)
        clearInterval(i);
    bgMusic.pause();
    let c = parseInt(data['coins']);
    c += totalCoins;
    //console.log(c);
    data['coins'] = c;
    data['beamCount'] = beamCount;
    data['freezeCount'] = freezeCount;
    data['shieldCount'] = shieldCount;
    data['invisibleCount'] = invisibleCount;
    data['bombCount'] = bombCount ;
    data['reverseEnabled'] = reverseEnabled;
    data['fuelConsumption'] = fuelConsumption;
    data['shieldTime'] = shieldTime;
    data['freezeTime'] = freezeTime;
    data['invisibleTime'] = invisibleTime;
    data['reverseEnabled'] = reverseEnabled;
    data['coinUpgrade'] = coinUpgrade;
    data['skillPoint'] = skillPoint;
    sessionStorage.setItem('data',JSON.stringify(data));
}
function skillCheck()
{
   var tree = document.getElementById('tree');
   var buttons = tree.getElementsByTagName('button');
    for(i=1;i<buttons.length;i++)
    {
        //console.log(button[i]);
        if(buttons[i].getAttribute('id')[7] != '1') 
            buttons[i].setAttribute('disabled','');
        if(buttons[i].getAttribute('id') == 'shd-lv-1' || buttons[i].getAttribute('id') == 'rev-lv-1')
            buttons[i].setAttribute('disabled','');
    }
        
    let skills = data['skills'];
    skills.forEach((skill)=>{
        if(skill[7] == '1')
        {
            document.getElementById(skill.slice(0,7)+'2').removeAttribute('disabled');
        }
        else
        {
            if(skill == 'inv-lv-2')
            {
                document.getElementById('shd-lv-1').removeAttribute('disabled');
            }
            if(skill == 'con-lv-2')
            {
                document.getElementById('rev-lv-1').removeAttribute('disabled');
            }
        }
        let ele = document.getElementById(skill);
        ele.classList.remove('btn-dark');
        ele.classList.add('btn-success');
        ele.setAttribute('disabled','');
    });
}
function skillUpgrade(id,type,required)
{
    if(skillPoint >= required)
    {   
        if(type == 'fuelConsumption')
            eval(type + '-=0.5');

        else if(id != 'rev-lv-1')
            eval(type + '+= 2000');
        else{
            reverseEnabled = true;
        }
        
        let ele = document.getElementById(id);
        //console.log(ele);
        ele.classList.remove('btn-dark');
        ele.classList.add('btn-success');
        ele.setAttribute('disabled','');
        // ele = document.getElementById(id.slice(0,7)+'2').removeAttribute('disabled')
        skillPoint -= required;
        data['skills'].push(id);
        skillCheck();
        
        skillPointEle.innerHTML = skillPoint;
    }
    else
    {
        let ele = document.getElementById('failure');
        ele.style.display = 'block';
        ele.classList.add('show');
        setTimeout(()=>{
            ele.style.display = 'none';
            ele.classList.remove('show');  
        },1000);
    }
}
function init()
{
    // boardEle.style.display = 'none';
    const shipImg = data['ship'];
    bulletColor = data['bulletColor'];
    doubleBullet = data['doubleBullet'];
    beamCount = parseInt(data['beamCount']);
    freezeCount = parseInt(data['freezeCount']);
    shieldCount = parseInt(data['shieldCount']);
    invisibleCount = parseInt(data['invisibleCount']);
    bombCount = parseInt(data['bombCount']);
    shieldTime = parseInt(data['shieldTime']);
    freezeTime = parseInt(data['freezeTime']);
    invisibleTime = parseInt(data['invisibleTime']);
    reverseEnabled = data['reverseEnabled'];
    reverseTime = parseInt(data['reverseTime']);
    //fuelConsumption = parseInt(data['fuelConsumption']);
    fuelConsumption = 1.5;
    coinUpgrade  = parseInt(data['coinUpgrade']);
    skillPoint =  parseInt(data['skillPoint']);
    skillPoint = 15;
    skillCheck();
    player =  new Ship(10,canv.height/2-40,shipImg,100,100);
    shield = new Shield();
    reactor = new Abilities(player.x+100,player.y+30,'imgs/abil-1.png',0,0,{x:0},'reactor');
    bullets = [];
    enemy_bullets = [];
    enemies = [];
    coins = [];
    // bombs = [];
    rewindData = [];
    score = 0;
    totalCoins = 0
    life = 3;
    limit = 500;
    fuel = 100;
    abilityTime = 4000;
    progressLimit = 2;
    progressValue = 0;
    reactorEnable = true;
    scoreEle.innerHTML = "0";
    // boardScore.innerHTML = "0";
    progressEle.setAttribute('value','0');
    progressEle.setAttribute('max',progressLimit);
    lifeEle.innerHTML='<span id="1">&hearts;</span><span id="2">&hearts;</span><span id="3">&hearts;</span>';
    skillPointEle.innerHTML = skillPoint;
    player.draw();
    //refuel();
    startGame();
    spawnAl1();
    setTimeout(spawnAl2,10000);
    alien_shoot();
    setTimeout(spawnAliensShip,20000);
    spawnHeart();
    spawnAbility();
    spawnFuelStation();
    setInterval(backUp,1000) ;
    //spawnBoss();
    //bgMusic.play();  
}


//init();