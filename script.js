let cellsList = document.querySelectorAll('div.main__cell');
let maxIndex = Math.sqrt(cellsList.length);
let cells = [];
let snake = [];
let xHead;
let yHead;
let exTail;
let cellEat;
let cellBonusEat;
let restartBtn;
let score = 0;
let scoreOutput = document.querySelector('.score__score');
let record = 0;
let recordOutput = document.querySelector('.score__record');
let hintTimer;
let hintOutput = document.querySelector('.score__hint');
let settingsBtn = document.querySelector('.settings');
let startBtn = document.querySelector('.start');
let countEat = 0;
let cellsObstacles = [];
let bonusTimer = 10000;
let bonusSec = bonusTimer / 1000;
let obstacleTimer = 30000;
let needObstacle = true;
let direction = 'left';
let intervalOfMoving;
let intervalOfChangeObstacle;
let IntervalOfHint;
let difficulty = 5.5;
let listenForMove = (e) => {
    if (e.defaultPrevented) {
        return;
    }
    if ((e.key == 'w' || e.key == 'W' || e.key == 'ц' || e.key == 'Ц' || e.key == 'ArrowUp')
        && direction != 'down' && direction != 'up') {
        clearInterval(intervalOfMoving);
        moving(shiftUp);
    }
    if ((e.key == 's' || e.key == 'S' || e.key == 'ы' || e.key == 'Ы' || e.key == 'ArrowDown')
        && direction != 'up' && direction != 'down') {
        clearInterval(intervalOfMoving);
        moving(shiftDown);
    }
    if ((e.key == 'a' || e.key == 'A' || e.key == 'ф' || e.key == 'Ф' || e.key == 'ArrowLeft')
        && direction != 'right' && direction != 'left') {
        clearInterval(intervalOfMoving);
        moving(shiftLeft);
    }
    if ((e.key == 'd' || e.key == 'D' || e.key == 'в' || e.key == 'В' || e.key == 'ArrowRight')
        && direction != 'left' && direction != 'right') {
        clearInterval(intervalOfMoving);
        moving(shiftRight);
    }
    e.preventDefault();
};

let listenSettings = (e) => {
    let panel = document.querySelector('.settings__panel');
    panel.classList.toggle('active');
    settingsBtn.classList.toggle('rotate');
    startBtn.classList.toggle('active');
}

let listenStart = (e) => {
    settingsBtn.classList.toggle('active');
    startBtn.classList.toggle('active');
    init();
    makeSnake();
    document.addEventListener('keydown', listenForMove, true);
    moving(shiftLeft)
    makeEat();
    changeObstacle(needObstacle);
};

startBtn.addEventListener('click', listenStart, true);
settingsBtn.addEventListener('click', listenSettings, true);

document.querySelector('#obstacles').addEventListener('click', (e) => {
    needObstacle = !needObstacle;
});
document.querySelector('#veryHard').addEventListener('click', (e) => {
    difficulty = 5.5;
});
document.querySelector('#hard').addEventListener('click', (e) => {
    difficulty = 5;
});
document.querySelector('#medium').addEventListener('click', (e) => {
    difficulty = 4.5;
});
document.querySelector('#easy').addEventListener('click', (e) => {
    difficulty = 4;
});
document.querySelector('#snail').addEventListener('click', (e) => {
    difficulty = 3.5;
});

function init() {
    for (let i = 0; i < maxIndex; i++) {
        cells.push([]);
    }
    for (let i = 0; i < cellsList.length; i++) {
        cells[i % maxIndex].push(cellsList[i]);
    }
}

function makeSnake() {
    xHead = 36;
    yHead = 32;
    cells[36][32].classList.add('snake', 'snake__head');
    cells[37][32].classList.add('snake');
    cells[38][32].classList.add('snake');

    snake.push(cells[36][32]);
    snake.push(cells[37][32]);
    snake.push(cells[38][32]);
}

function deleteHead() {
    snake[0].classList.remove('snake__head');
}

function makeHead() {
    snake[0].classList.add('snake__head');
}

function shift() {
    cells[xHead][yHead].classList.add('snake');
    deleteHead();
    snake.unshift(cells[xHead][yHead]);
    exTail = snake[snake.length - 1];
    snake.pop().classList.remove('snake');
    makeHead();
    checkLose();
    checkEat();
    checkBonusEat();
}

function shiftUp() {
    yHead = (yHead - 1 + maxIndex) % maxIndex;
    shift();
    direction = 'up';
}

function shiftDown() {
    yHead = (yHead + 1) % maxIndex;
    shift();
    direction = 'down';
}

function shiftLeft() {
    xHead = (xHead - 1 + maxIndex) % maxIndex;
    shift();
    direction = 'left';
}

function shiftRight() {
    xHead = (xHead + 1) % maxIndex;
    shift();
    direction = 'right';
}

function moving(func) {
    intervalOfMoving = setInterval(func, 600 - difficulty * 100);
}

function getRandomCell() {
    let xRandom;
    let yRandom;
    do {
        xRandom = Math.floor(Math.random() * 63.99999);
        yRandom = Math.floor(Math.random() * 63.99999);
    } while (cells[xRandom][yRandom].classList.contains('snake') ||
    cells[xRandom][yRandom].classList.contains('bonus-eat') ||
    cells[xRandom][yRandom].classList.contains('eat') ||
    cells[xRandom][yRandom].classList.contains('obstacle') ||
        (((xHead + 7) % maxIndex > xRandom) && ((xHead - 7 + maxIndex) % maxIndex < xRandom) &&
            ((yHead + 7) % maxIndex > yRandom) && ((yHead - 7 + maxIndex) % maxIndex < yRandom)));
    return cells[xRandom][yRandom];
}

function getRandomBonusCell() {
    let xRandom;
    let yRandom;
    do {
        xRandom = Math.floor(Math.random() * 63.99999);
        yRandom = Math.floor(Math.random() * 63.99999);
    } while (cells[xRandom][yRandom].classList.contains('snake') ||
    cells[xRandom][yRandom].classList.contains('bonus-eat') ||
    cells[xRandom][yRandom].classList.contains('eat') ||
    cells[xRandom][yRandom].classList.contains('obstacle') ||
        (((xHead + 15) % maxIndex < xRandom) && ((xHead - 15 + maxIndex) % maxIndex > xRandom) &&
            ((yHead + 15) % maxIndex < yRandom) && ((yHead - 15 + maxIndex) % maxIndex > yRandom)));
    return cells[xRandom][yRandom];
}

function makeEat() {
    cellEat = getRandomCell();
    cellEat.classList.add('eat');
}

function makeBonusEat() {
    cellBonusEat = getRandomBonusCell();
    cellBonusEat.classList.add('bonus-eat');
}

function makeObstacle() {
    for (let i = 0; i < maxIndex; i++) {
        cellsObstacles.push(getRandomCell());
        cellsObstacles[i].classList.add('obstacle');
    }
}

function removeObstacle() {
    for (i of cellsObstacles) {
        i.classList.remove('obstacle');
    }
    cellsObstacles = [];
}

function changeObstacle(needObstacle) {
    if (needObstacle) {
        intervalOfChangeObstacle = setInterval(() => { removeObstacle(); makeObstacle(); },
            obstacleTimer - difficulty * 5000);
    }
}

function removeBonusEat() {
    setTimeout(() => cellBonusEat.classList.remove('bonus-eat'), bonusTimer);
}

function checkEat() {
    if (document.querySelectorAll('div.snake__head.eat').length > 0) {
        let eat = document.querySelector('div.snake__head.eat');
        eat.classList.remove('eat');
        countEat++;
        exTail.classList.add('snake');
        snake.push(exTail);
        deleteHead();
        makeHead();
        makeEat();
        checkBonusTime();
        addScore();
    }
}
function checkBonusEat() {
    if (document.querySelectorAll('div.snake__head.bonus-eat').length > 0) {
        let eat = document.querySelector('div.snake__head.bonus-eat');
        eat.classList.remove('bonus-eat');
        exTail.classList.add('snake');
        snake.push(exTail);
        deleteHead();
        makeHead();
        addScoreForBonus();
        removeHint();
    }
}

function checkBonusTime() {
    if (countEat % 5 == 0) {
        countEat = 0;
        makeBonusEat();
        removeBonusEat();
        makeHint();
    }
}

function checkLose() {
    if ((snake.length != new Set(snake).size) ||
        (document.querySelectorAll('div.snake__head.obstacle').length > 0)) {
        clearInterval(intervalOfMoving);
        clearInterval(intervalOfChangeObstacle);
        document.removeEventListener('keydown', listenForMove, true);
        removeAll();
        changeMain();
        checkRecord();
        removeHint();
        zeroingScore();
        countEat = 0;
    }
}

function removeAll() {
    removeObstacle();
    if (cellBonusEat) {
        cellBonusEat.classList.remove('bonus-eat');
    }
    cellEat.classList.remove('eat');
    for (i of snake) {
        i.classList.remove('snake__head', 'snake');
    }
    xHead = null;
    yHead = null;
    snake = [];
}

function changeMain() {
    settingsBtn.classList.toggle('active');
    startBtn.classList.toggle('active');
}

function addScore() {
    score += difficulty * 10;
    scoreOutput.innerHTML = 'Score: ' + score;
}

function addScoreForBonus() {
    score += difficulty * 10 * bonusSec;
    scoreOutput.innerHTML = 'Score: ' + score;
}

function zeroingScore() {
    score = 0;
    scoreOutput.innerHTML = 'Score: ' + score;
}

function checkRecord() {
    if (score > record) {
        record = score;
        recordOutput.innerHTML = 'Record: ' + record;
    }
}

function makeHint() {
    hintOutput.style.visibility = 'visible';
    IntervalOfHint = setInterval(() => {
        if (bonusSec == 1) {
            removeHint();
        }
        bonusSec--;
        hintOutput.innerHTML = 'Bonus eat disappearing in: ' + bonusSec + ' sec';
    }, 1000);
}

function removeHint() {
    bonusSec = bonusTimer / 1000;
    clearInterval(IntervalOfHint);
    hintOutput.style.visibility = 'hidden';
    hintOutput.innerHTML = 'Bonus eat disappearing in: 10 sec';
}