//Setting up the canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: undefined,
    y: undefined
}


class Ball {
    constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.speed = 7;
    }

    draw () {
        ctx.beginPath();
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.closePath();
    }

    update () {
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

class Board {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.score = 0;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        document.addEventListener('mousemove', event => {
            let rect = canvas.getBoundingClientRect();
            this.y = event.clientY - rect.top - (this.height / 2);
        });
        this.draw();
    }
}

let radius = 20;
let x = (innerWidth - radius) / 2;
let y = (innerHeight - radius) / 2;

let boardx = 0;
let boardwidth = 20;
let boardheight = 100;
let boardy = canvas.height / 2 - (boardheight / 2);

let compx = canvas.width - boardwidth;

let velocityX;
let velocityY;

const randomVelocity = () => {
    let randomNum = Math.random();
    if (randomNum <= 0.25) {
        velocityX = -5;
        velocityY = 5;
    }
    else if (randomNum > 0.25 && randomNum <= 0.5) {
        velocityX = 5;
        velocityY = -5;
    }
    else if (randomNum > 0.5 && randomNum <= 0.75) {
        velocityX = 5;
        velocityY = 5;
    }
    else {
        velocityX = -5;
        velocityY = -5;
    }
}

randomVelocity();

const ball = new Ball(x, y, velocityX, velocityY, radius);
const board = new Board(boardx, boardy, boardwidth, boardheight);

class Computer extends Board {
    constructor(x, y, width, height, dx, dy) {
        super(x, y, width, height, dx, dy);
        this.computerLevel = 0.07;
        this.score = 0;
    }
    
    update () {
        this.draw();
        this.y += (ball.y - (this.y + (this.height / 2))) * this.computerLevel;
    }

}

const computer = new Computer(compx, boardy, boardwidth, boardheight);

const gameOver = () => {
    if (ball.x - ball.radius < 0) {
        computer.score ++;
        ball.x = x;
        ball.y = y;
        board.x = boardx;
        board.y = boardy;
        randomVelocity();
    }
    else if (ball.x + ball.radius > canvas.width) {
        board.score ++;
        ball.x = x;
        ball.y = y;
        board.x = boardx;
        board.y = boardy;
        randomVelocity();
    }
}

const collision = (ball, board) => {
    board.top = board.y;
    board.bottom = board.y + board.height;
    board.left = board.x;
    board.right = board.x + board.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return board.left < ball.right && board.top < ball.bottom && board.right > ball.left && board.bottom > ball.top;
}

const collideUpdate = (ball, board) => {
    let collidePoint = (ball.y - (board.y + board.height/2));
    collidePoint = collidePoint / (board.height/2);
        
    let angleRad = (Math.PI/4) * collidePoint;
        
    let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
    ball.dx = direction * ball.speed * Math.cos(angleRad);
    ball.dy = ball.speed * Math.sin(angleRad);
        
    ball.speed += 0.01;
}

const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ball.update();
    board.update();
    computer.update();
    if (collision(ball, board)) {
        collideUpdate(ball, board);
    }
    if (collision(ball, computer)) {
        collideUpdate(ball, computer);
    };

    gameOver();
    ctx.font = "30px Arial";
    ctx.fillText(board.score, canvas.width / 4, 50);
    ctx.fillText(computer.score, (canvas.width * 3) / 4, 50);
}

animate();
