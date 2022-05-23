let cellsList = document.querySelectorAll('div.main__cell');
let cells = [];
let maxIndex = Math.sqrt(cellsList.length);
for (let i = 0; i < maxIndex; i++) {
    cells.push([]);
}
for (let i = 0; i < cellsList.length; i++) {
    cells[i % maxIndex].push(cellsList[i]);
}

cells[36][32].classList.add('snake');
cells[37][32].classList.add('snake');
cells[38][32].classList.add('snake');

let snakeList = document.querySelectorAll('div.snake');
let snake = Array.prototype.slice.call(snakeList);
let xHead = 36;
let yHead = 32;
let direction = 'left';
let intervalOfMoving;
////////////////////////////
let difficulty = 0.5;

makeHeadAndTail();
move();


function deleteHeadAndTail() {
    for (let i = 0; i < snake.length; i++) {
        snake[i].classList.remove('snake_head', 'snake_tail');
    }
}

function makeHeadAndTail() {
    snake[0].classList.add('snake_head');
    snake[snake.length - 1].classList.add('snake_tail');
}

function move() {
    document.addEventListener('keydown', (e) => {
        if (e.defaultPrevented) {
            return;
        }
        if ((e.key == 'w' || e.key == 'W' || e.key == 'ц' || e.key == 'Ц' || e.key == 'ArrowUp') 
        && direction != 'down' && direction != 'up') {
            if (direction != 'up') { clearInterval(intervalOfMoving);}
            direction = 'up';
            moving(shiftUp);
        }
        if ((e.key == 's' || e.key == 'S' || e.key == 'ы' || e.key == 'Ы' || e.key == 'ArrowDown') 
        && direction != 'up' && direction != 'down') {
            if (direction != 'down') { clearInterval(intervalOfMoving);}
            direction = 'down';
            moving(shiftDown);
        }
        if ((e.key == 'a' || e.key == 'A' || e.key == 'ф' || e.key == 'Ф' || e.key == 'ArrowLeft') 
        && direction != 'right' && direction != 'left') {
            if (direction != 'left') { clearInterval(intervalOfMoving);}
            direction = 'left';
            moving(shiftLeft);
        }
        if ((e.key == 'd' || e.key == 'D' || e.key == 'в' || e.key == 'В' || e.key == 'ArrowRight') 
        && direction != 'left' && direction != 'right') {
            if (direction != 'right') { clearInterval(intervalOfMoving);}
            direction = 'right';
            moving(shiftRight);
        }
        e.preventDefault();
    }, true);
}

function shiftUp() {
    cells[xHead][(yHead - 1 + maxIndex) % maxIndex].classList.add('snake');
    snake.unshift(cells[xHead][(yHead - 1 + maxIndex) % maxIndex]);
    yHead = (yHead - 1 + maxIndex) % maxIndex;
    deleteHeadAndTail();
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
}

function shiftDown() {
    cells[xHead][(yHead + 1) % maxIndex].classList.add('snake');
    snake.unshift(cells[xHead][(yHead + 1) % maxIndex]);
    yHead = (yHead + 1) % maxIndex;
    deleteHeadAndTail();
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
}

function shiftLeft() {
    cells[(xHead - 1 + maxIndex) % maxIndex][yHead].classList.add('snake');
    snake.unshift(cells[(xHead - 1 + maxIndex) % maxIndex][yHead]);
    xHead = (xHead - 1 + maxIndex) % maxIndex;
    deleteHeadAndTail();
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
}

function shiftRight() {
    cells[(xHead + 1) % maxIndex][yHead].classList.add('snake');
    snake.unshift(cells[(xHead + 1) % maxIndex][yHead]);
    xHead = (xHead + 1) % maxIndex;
    deleteHeadAndTail();
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
}

function moving(func) {
    intervalOfMoving = setInterval(func, 1000 * difficulty);
}


    // 1 раз в секунду * коэфф сложности выполняется сдвиг змеи
