const boardELement = document.getElementById("board");
const xWinsElement = document.getElementById('xwins');
const oWinsElement = document.getElementById('owins');
const restartButton = document.getElementById('restart');
const result = document.getElementById('result');

let board = Array(9).fill(null);
let xWins = 0;
let oWins = 0;
let currentPlayer = 'X';

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
];

function renderBoard(){
    boardELement.innerHTML= '';
    board.forEach((cell, index) =>{
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        if (cell) {
            cellElement.classList.add(cell);
            cellElement.classList.add('taken');
        }
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => playerMove(index));
        boardELement.appendChild(cellElement);
    });
}

function checkWinner(){
    for(const combination of winningCombinations){
        const [a,b,c] = combination;
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            return board[a];
        }
    }
    return null;
}

function updateScore(){
    if(currentPlayer === 'X'){
        xWins++;
        xWinsElement.textContent = xWins;
    }else{
        oWins++;
        oWinsElement.textContent = oWins;
    }
}

function playerMove(index){
    if(board[index] || checkWinner()) return;
    board[index] = currentPlayer;
    renderBoard();
    console.log("player made a move")

    if(checkWinner()){
        updateScore();
        result.textContent = `${currentPlayer} wins!!!`;
        return;
    }

    if(board.every(cell => cell)){
        result.textContent = " It's a draw";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? "O" : "X";
    if(currentPlayer === 'O'){
        computerMove()
    }
}

function computerMove(){
    const bestMove = getBestMove();
    board[bestMove] = 'O';
    renderBoard();
    console.log("computer made a move")

    if(checkWinner()){
        updateScore();
        result.textContent = "O's wins!!!"
        return;
    }else if(board.every(cell => cell)){
        result.textContent = "It's a draw";
    }
    currentPlayer = 'X';
}

function getBestMove(){
    let bestScore = -Infinity;
    let move;

    board.forEach((cell, index) =>{
        if(!cell){
            board[index] = 'O';
            const score = minimax(board, 0, false);
            board[index] = null;
            if(score > bestScore){
                bestScore = score;
                move = index;
            }
        }
    });
    return move;
}

function minimax(board, depth, isMaximizing){
    const winner  = checkWinner();
    if(winner === 'X') return -10;
    if(winner === 'O') return 10;
    if(board.every(cell => cell)) return 0;

    if(isMaximizing){
        let bestScore = -Infinity;
        board.forEach((cell, index) =>{
           if(!cell){
                board[index] = 'O';
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[index] = null;
           }
        });
        return bestScore;
    }else{
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if(!cell){
                board[index] = 'X';
                bestScore = Math.min(bestScore, minimax(board, depth + 1 , true));
                board[index] = null;
            }
        });
        return bestScore;
    }
}

restartButton.addEventListener('click', () => {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    renderBoard();
})

renderBoard();