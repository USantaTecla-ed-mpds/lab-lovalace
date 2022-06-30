//board[fila][columna]--Alberto--
const { Console } = require("console-mpds");
const console = new Console();
console.writeln(`hola mundo`);
do {
    playGame();
} while (isResumed())

function isResumed() {
    let resume = console.readString(`quieres continuar? (y/n):`)
    return resume[0] === "y";
}
function playGame() {


    let game = createGameData();
   // createBoard(game);


    resetBoard(game);
    showBoard(game);
    do {
        changeActivePlayer(game);

        chooseValidColumn(game);
        insertToken(game);
        showBoard(game);

        if (game.plays >= game.SHORTEST_WIN) {
            game.win = winGame(game.board, game.lastColumnInsert)
        }

    } while (game.plays < game.FULL_BOARD && !game.win)
    let msg = `tablero lleno, se acabó el juego.`;
    if (game.win) {
        msg = `Jugador ${game.activePlayer} ha ganado la partida`;
    }
    console.writeln(msg);

    function createGameData() {
        return {
            plays: 0,
            COL_AND_ROWS: 9,
            MAX_ROW: 7,
            MAX_COLUMN: 7,
            FULL_BOARD: 42,
            win: false,
            SHORTEST_WIN: 7,
            GAME_MODE: setGameMode(),
            lastColumnInsert: 0,
            board: createBoard(9)
            

        }
    }
    function changeActivePlayer(game) {
        game.activePlayer = game.plays % 2 + 1;
        game.plays++;
    }
    function createBoard(COL_AND_ROWS) {
        board = new Array(COL_AND_ROWS);
        for (let i = 0; i < COL_AND_ROWS; i++) {
            board[i] = new Array(COL_AND_ROWS);
        }
        return board;
    }
    function manual(player) {
        return console.readNumber(`jugador ${player}, Escoge una columna (1-7)`);
    }
    function automatic() {
        const MAX_COLUMN = 8;
        return parseInt(Math.random() * MAX_COLUMN);
    }
    function setGameMode() {
        const GAME_MODE_NAMES = ["Jugador contra Jugador", "Jugador contra Computador", "Computador contra Computador"];
        let msg = (`\n----- 4inRow -----\ \n\nMODOS DE JUEGO`);
        for (let i = 0; i < GAME_MODE_NAMES.length; i++) {
            msg += `\n${i + 1}. ${GAME_MODE_NAMES[i]}`;
        }
        console.writeln(msg);
        const index = console.readNumber(`Elige un modo de juego (1, 2 o 3): `) - 1;
        return [[manual, manual], [manual, automatic], [automatic, automatic]][index];
    }
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
    function chooseValidColumn(game) {
        let numberColumn;
        const playMode = game.GAME_MODE[game.activePlayer - 1]
        do {
            numberColumn = playMode(game.activePlayer);
        } while (numberColumn > game.MAX_COLUMN || numberColumn <= 0 || game.board[0][numberColumn] == game.MAX_ROW)
        game.lastColumnInsert = numberColumn;
    }
    function insertToken({ lastColumnInsert, activePlayer, board }) {
        board[0][lastColumnInsert]++;
        board[board[0][lastColumnInsert]][lastColumnInsert] = activePlayer;
    }
    function resetBoard({ board, COL_AND_ROWS }) {
        const VALUES = [0, 1, 2, 3];
        const BORDER=8;
        for (let i = 0; i < COL_AND_ROWS; i++) {
            for (let j = 0; j < COL_AND_ROWS; j++) {
                if (i == 1 || i == BORDER || j == 0 || j == BORDER) {
                    board[i][j] = VALUES[3];
                } else if (i == 0) {
                    board[i][j] = VALUES[1];
                } else {
                    board[i][j] = VALUES[0];
                }
            }
        }
    }
    function showBoard({ board, COL_AND_ROWS, plays }) {
        let msg = "";
        for (let i = COL_AND_ROWS - 1; i >= 0; i--) {
            for (let j = 0; j < COL_AND_ROWS; j++) {
                msg += board[i][j] + " ";
            }
            msg += "\n";
        }
        console.writeln(`${plays} jugadas`);
        console.writeln(msg);
    }
}