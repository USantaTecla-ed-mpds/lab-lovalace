    //board[fila][columna]--Alberto--
const { Console } = require("console-mpds");
const console = new Console();
console.writeln(`hola mundo`);
do {
    playGame();
} while (isResumed())
function isResumed() {
    let resume = console.readString(`quieres continuar? (y/n):`)
    if (resume.charAt(0) === "y") {
        return true;
    } else {
        return false;
    }
}
function playGame() {
    let plays = 0;
    let activePlayer;
    const COLANDROWS = 9;
    const FULLBOARD = 42
    let win = false;
    const SHORTESTWIN = 7;
    let board = new Array(COLANDROWS);
    for (let i = 0; i < COLANDROWS; i++) {
        board[i] = new Array(COLANDROWS);
    }
    resetBoard(board, COLANDROWS);
    showBoard(board, COLANDROWS);
    do {
        activePlayer = plays % 2 + 1;
        plays++;
        console.writeln(`${plays} jugadas`);
        let lastColumnInsert = chooseValidColumn(board, activePlayer);
        insertToken(lastColumnInsert, activePlayer, board);
        showBoard(board, COLANDROWS);
       
        if (plays >= SHORTESTWIN) {
            win = winGame(board, lastColumnInsert)
        }

    } while (plays < FULLBOARD && !win)
    let msg = `tablero lleno, se acabó el juego.`;
    if (win) {
        msg = `Jugador ${activePlayer} ha ganado la partida`;
    }
    console.writeln(msg);

    function winGame(board, column) {
        let col = column;
        let row = board[0][col];
        let win;
        win = checkVertical(board, col, row)
        if (!win) {
            win = checkHorizontal(board, col, row);
        }
        if (!win) {
            win = checkDiagonalUp(board, col, row);
        }
        if (!win) {
            win = checkDiagonalDown(board, col, row);
        }
        return win;
        function checkDiagonalDown(board, column, row) {
            let same = true;
            let acum = 1;
            let win = false;
            for (let i = row, j = column; same; i--, j++) {
                if (board[i][j] == board[i - 1][j + 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            same = true;
            for (let i = row, j = column; same; i++, j--) {
                if (board[i][j] == board[i + 1][j - 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            if (acum >= 4) {
                win = true;
            }
            return win;
        }
        function checkDiagonalUp(board, column, row) {
            let same = true;
            let acum = 1;
            let win = false;
            for (let i = row, j = column; same; i++, j++) {
                if (board[i][j] == board[i + 1][j + 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            same = true;
            for (let i = row, j = column; same; i--, j--) {
                if (board[i][j] == board[i - 1][j - 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            if (acum >= 4) {
                win = true;
            }
            return win;
        }
        function checkHorizontal(board, column, row) {
            let same = true;
            let acum = 1;
            let win = false;
            for (let i = column; same; i++) {
                if (board[row][i] == board[row][i + 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            same = true;
            for (let i = column; same; i--) {
                if (board[row][i] == board[row][i - 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            if (acum >= 4) {
                win = true;
            }
            return win;
        }
        function checkVertical(board, column, row) {
            let same = true;
            let acum = 1;
            let win = false;
            for (let i = row; same; i--) {
                if (board[i][column] == board[i - 1][column]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            if (acum === 4) {
                win = true;
            }
            return win;
        }
    }
    function chooseValidColumn(board, player) {
        let numberColumn;
        do {
            numberColumn = console.readNumber(`jugador ${player}, Escoge una columna (1-7)`)
        } while (numberColumn > 7 || numberColumn <= 0 || board[0][numberColumn] == 7)
        return numberColumn;
    }
    function insertToken(column, activePlayer, board) {
        board[0][column]++;
        board[board[0][column]][column] = activePlayer;
    }
    function resetBoard(board, COLANDROWS) {
        const VALUES = [0, 1, 2, 3]
        for (let i = 0; i < COLANDROWS; i++) {
            for (let j = 0; j < COLANDROWS; j++) {
                if (i == 1 || i == 8 || j == 0 || j == 8) {
                    board[i][j] = VALUES[3];
                } else if (i == 0) {
                    board[i][j] = VALUES[1];
                } else {
                    board[i][j] = VALUES[0];
                }
            }
        }
    }
    function showBoard(board, COLANDROWS) {
        let msg = "";
        for (let i = COLANDROWS - 1; i >= 0; i--) {
            for (let j = 0; j < COLANDROWS; j++) {
                msg += board[i][j] + " ";
            }
            msg += "\n";
        }
        console.writeln(msg);
    }
}