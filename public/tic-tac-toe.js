// Your code here

// set Game global vars:
let gameStatus = 'go' // won tied
let moves = 9;
let isMoveX = true;
let gameboardLogic = new Array(3).fill(null).map(() => new Array(3).fill(null));
//  [
//    [null, null, null],
//    [null, null, null],
//    [null, null, null]
//  ]

//set global DOM vars
let newGameButton, giveUpButton;
let gameHeader;
let imageX, image0;
const imageXsrc = "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg"
const image0src = "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg"


// looking for click:
document.addEventListener("DOMContentLoaded", () => {
    const gameEl = document.getElementById("game-container");
    // filling some elements
    newGameButton = document.getElementById("new-game")
    giveUpButton = document.getElementById("give-up")
    gameHeader = document.getElementById('game-header');
    imageX = document.createElement('img')
    imageX.src = imageXsrc;
    image0 = document.createElement('img');
    image0.src = image0src;

    // if cookies, restore game
    if (document.cookie) {
        restoreGame();        
    }

    // listen to clicks now;
    gameEl.addEventListener("click", click)
})

function click(e) { // catch cell click and make logic
    e.stopPropagation();                // listen only this click el            
    clickRespond(e)
}

function clickRespond(e) { // game logic handler
    const clicked = e.target
  
    // process buttons:
    if (clicked === newGameButton) newGame();
    if (clicked === giveUpButton) giveUp();

    // if empty cell, and active game, do move :
    if (clicked.classList.contains('cell') && clicked.innerHTML === ''
        && (gameStatus !== 'won' && gameStatus !== 'tie')) {

        // doMoveDOM
        doMoveDOM(clicked)

        // doMoveGame        
        gameStatus = doMoveGame(gameboardLogic, clicked.dataset.cellrow, clicked.dataset.cellcol)

        // process result:
        if (gameStatus === 'won' || gameStatus === 'tie') {
            endGame(gameStatus)
        }
        // if not the end, currently just go 
    }
    // no more press cases    
    // but lets save game status on click    
    saveGame()
}

function doMoveDOM(cell) {
    // draw X 0 and remove hover
    
    
    if (isMoveX) {
        cell.appendChild(imageX.cloneNode()) // imageX;                
    } else {
        cell.appendChild(image0.cloneNode()) // image0;
    }

    cell.classList.remove("hoverable");
}

function doMoveGame(gameboardLogic, row, col) {
    // also handling global - moves, isMoveX
    // mark in gameboardLogic    
    gameboardLogic[row][col] = isMoveX;
    //  ...and lower moves count
    moves--;
    
    // Check win condition:  
    if (checkWin(gameboardLogic, row, col, isMoveX)) return 'won'

    // Check if no moves:  
    if (moves === 0) return 'tie';

    // if continue, revert turn 
    isMoveX = !isMoveX;
  
    return 'go'
};

function endGame(status) {  // pure DOM adjusting
    // set gameHeader:    
    if (status === 'tie') {
        winner = 'None'
    } else {
        if (isMoveX) winner = 'X';
        else winner = '0'
    }
    gameHeader.innerText = 'Winner: ' + winner;
    gameHeader.classList.remove('hidden')

    // remove hower from cells
    let cells = Array.from(document.getElementsByClassName("cell"));
    for (const cell of cells) {
        // set cells non-hoverable
        cell.classList.remove("hoverable");
    }

    // switch buttons enabled
    newGameButton.disabled = false;
    giveUpButton.disabled = true;
};

function newGame() {
    //DOM:
    // disable NewGame button:
    newGameButton.disabled = true;
    giveUpButton.disabled = false;
    // hide gameHeader:    
    gameHeader.classList.add('hidden')
    // clears the board:
    boardInit();
    //Game:
    //clearing the game status:
    gameStatus = 'go';
    // makes it so the next click of the tic-tac-toe board is an "X"
    isMoveX = true;
    // set moves
    moves = 9;
    // reset board:
    gameboardLogic = new Array(3).fill(null).map(() => new Array(3).fill(null));

    // init saving (remove cookies)
    saveGame('init')
}
function giveUp() {   
    isMoveX = !isMoveX // if X is giveUp, winner is 0
    gameStatus = 'won'
    endGame('won');
}

function boardInit() { // DOM
    let cells = Array.from(document.getElementsByClassName("cell"));
    for (const cell of cells) {
        // set cells hoverable
        cell.classList.add("class", "hoverable");
        // remove inner
        cell.innerHTML = '';
    }
};

function checkWin(gameboardLogic, row, col, isMoveX) {    // game
    let rowCount = 0, colCount = 0, diag = 0, rdiag = 0;
    for (let i = 0; i < 3; i++) {
        if (gameboardLogic[row][i] === isMoveX) colCount++;
        if (gameboardLogic[i][col] === isMoveX) rowCount++;
        if (gameboardLogic[i][i] === isMoveX) diag++;
        if (gameboardLogic[i][3 - 1 - i] === isMoveX) rdiag++;
    }
    // return if end:    
    if (rowCount === 3 || colCount === 3 || diag === 3 || rdiag === 3) return true;
    else return false;
}
function saveGame(toInit) {    
  if (toInit === 'init') {
    deleteCookies();
    return;
  }
  //savelist: gameStatus, moves, isMoveX, gameboardLogic, gameHeader
  document.cookie = 'gameStatus=' + gameStatus;
  document.cookie = 'moves=' + moves;
  document.cookie = 'isMoveX=' + isMoveX;
  document.cookie = 'gameboardLogic=' + arr2DtoString(gameboardLogic);
  document.cookie = 'gameHeader=' + headerToString (gameHeader);
}
function restoreGame() {    
  let cookies = document.cookie.split('; ')
  // simply set:  
  gameStatus = cookies.find(cookie => cookie.startsWith('gameStatus=')).split('=')[1];
  moves = 0 + cookies.find(cookie => cookie.startsWith('moves=')).split('=')[1];
  isMoveX = ('true' === cookies.find(cookie => cookie.startsWith('isMoveX=')).split('=')[1]);
  
  // to process:
  let gameHeaderString = cookies.find(cookie => cookie.startsWith('gameHeader=')).split('=')[1];
  let gameboardLogicString = cookies.find(cookie => cookie.startsWith('gameboardLogic=')).split('=')[1];
  setHeaderFromString(gameHeaderString);
  setBoardFromString(gameboardLogicString);  
}

// -------------helper functions:---------------------
function setHeaderFromString(gameHeaderString) {    
    if (gameHeaderString) {
        gameHeader.innerText = gameHeaderString;
        gameHeader.classList.remove('hidden')
    }
    else gameHeader.classList.add('hidden')
    
}
function setBoardFromString(gameboardLogicString){  
    // need set DOM (sign and hover attr) and game boards
    let i = 0; // in string
    let cells = document.getElementsByClassName('cell');
    for (let row = 0; row < 3; row ++) {
        for (let col = 0; col < 3; col ++) {
            if (gameboardLogicString[i] === 'X') {
                cells[i].appendChild(imageX.cloneNode())
                cells[i].classList.remove('hoverable')
                gameboardLogic[row][col] = true;

            } else if (gameboardLogicString[i] === '0') {
                cells[i].appendChild(image0.cloneNode());
                cells[i].classList.remove('hoverable')
                gameboardLogic[row][col] = false;    

            } else {
                //DOM board is just empty, as is
                gameboardLogic[row][col] = null; // replacing visual cookie symbol 
            }

            i++;
        }
    }
    // and also set buttons:
    if (gameStatus === 'won' || gameStatus === 'tie') {
        newGameButton.disabled = false;
        giveUpButton.disabled = true;
    } else {
        newGameButton.disabled = true;
        giveUpButton.disabled = false;
    

    };
};  
function arr2DtoString(gameboardLogic) {
    let string = ''   
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (gameboardLogic[row][col] === true) string += 'X'
            else if (gameboardLogic[row][col] === false) string += '0'
            else string += '-';
        }
    }
    return string;
}
function headerToString (gameHeader) {    
    if (gameHeader.classList.contains('hidden'))  return '' // hidden
    return gameHeader.innerText;
}
function deleteCookies () {  
    // retrieve all cookies
    let cookies = document.cookie.split('; ');
    // set past expiry to all cookies
    for (const cookie of cookies) {
        document.cookie = cookie + "; max-age=0";    
    }   
}