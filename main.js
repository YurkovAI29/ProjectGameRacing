const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const startMusic = document.createElement('audio');
const runAuto = document.createElement('audio');
const bestScore = document.createElement('div');
const modalWindow = document.createElement('div');

let topScore = localStorage.getItem('topScore');

gameArea.appendChild(startMusic);
startMusic.setAttribute('autoplay', true);
startMusic.setAttribute('src', './audio/startGame.mp3');
startMusic.setAttribute('controls', true);

car.classList.add('car');
startMusic.classList.add('audio');
bestScore.classList.add('bestScore');
modalWindow.classList.add('modalWindow');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
};

function getQuantityElements(heightElement) {
    //return document.documentElement.clientHeight / heightElement + 1;
    return Math.ceil(gameArea.offsetHeight / heightElement);
}

function startGame(event){
    
    if (event.target.classList.contains('start')) {
        return;
    }
    
    if (event.target.classList.contains('easy')) {
       setting.speed = 3;
       setting.traffic = 3;
       setting.score += (setting.speed / 2);
    }

    if (event.target.classList.contains('middle')) {
        setting.speed = 5;
        setting.traffic = 2;
        setting.score += setting.speed;
    }

    if (event.target.classList.contains('hard')) {
        setting.speed = 7;
        setting.traffic = 2;
        setting.score += (setting.speed * 2);
    }

    start.classList.add('hide');
    startMusic.remove();
    gameArea.innerHTML = '';
    

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'transparent url(./image/enemy2.png) center / cover no-repeat';
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = '125px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    gameArea.appendChild(runAuto);
    runAuto.setAttribute('autoplay', true);
    runAuto.setAttribute('src', './audio/runAuto.mp3');
    //startMusic.setAttribute('controls', true);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame(){

    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML = 'YOUR SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    } else {
        runAuto.remove();
    }
}

function startRun(event){
    event.preventDefault();
    if (event.key in keys) {
        keys[event.key] = true;
    }
}

function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= gameArea.offsetHeight) {
            line.y = -50;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom && 
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {

                if (topScore < setting.score) {
                    localStorage.setItem('topScore', setting.score);
                    gameArea.appendChild(modalWindow);
                    modalWindow.innerHTML = 'Congratulations!!!<br> You set a new record';
                }

                gameArea.appendChild(bestScore);
                bestScore.innerHTML = 'Best result: ' + topScore;
                setting.start = false;
                start.classList.remove('hide');
                start.style.top = (score.offsetHeight - 10) + 'px';
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= gameArea.offsetHeight) {
            item.y = -200 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}
