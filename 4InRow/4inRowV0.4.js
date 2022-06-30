//board[fila][columna]--Alberto--
const { Console } = require("console-mpds");
const console = new Console();
COL_AND_ROWS = 9;
let panel = createPanel(COL_AND_ROWS);
let player = createPlayer();
let winner = createWinner();
let reset = createReset();
let askToContinue = () => console.readString(`quieres continuar? (y/n):`)[0] === "y";
do {
    reset.restart();
    panel.showBoard(player);
    do {
        player.changeActivePlayer();
        player.chooseValidColumn(panel);
        player.insertToken(panel);
        panel.showBoard(player);
        winner.win = winner.winGame(player, panel.board);
        winner.filledBoard(player);
    } while (!winner.win && !winner.fullBoard)
    winner.endGameMessage(player);
} while (askToContinue())

function createReset() {
    return {
        restart: function () {
            panel.resetBoard();
            player.plays = 0;
            player.GAME_MODE = player.setGameMode();
            winner.win = false;
            winner.fullBoard = false;
        }
    }
}
function createWinner() {
    return {
        MAX_TOKENS: 42,
        fullBoard: false,
        win: false,
        SHORTEST_WIN: 7,
        endGameMessage: function ({ activePlayer }) {
            if (this.win) {
                console.writeln(`El jugador ${activePlayer} ha ganado la partida.`);
            } else if (this.fullBoard) {
                console.writeln(`Empate, tablero lleno.`);
            }
        },
        filledBoard: function (player) {
            this.fullBoard = player.plays === this.MAX_TOKENS;
        },
        winGame: function ({ plays, lastColumnInsert }, board) {
            if (plays < this.SHORTEST_WIN) {
                return false;
            }
            let row = board[0][lastColumnInsert];
            let win;
   win = checkVertical(board, lastColumnInsert, row);
            if (!win) {
                win = checkHorizontal(board, lastColumnInsert, row);
            }
            if (!win) {
                win = checkDiagonalUp(board, lastColumnInsert, row);
            }
            if (!win) {
                win = checkDiagonalDown(board, lastColumnInsert, row);
            }
            return win;
        },
    };
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
function createPlayer() {
    let returned = {
        plays: 0,
        GAME_MODE: null,
        lastColumnInsert: 0,
        activePlayer: 0,
        changeActivePlayer: function () {
            this.activePlayer = this.plays % 2 + 1;
            this.plays++;
        },
        chooseValidColumn: function ({ MAX_COLUMN, MAX_ROW, board }) {
            let numberColumn;
            const playMode = this.GAME_MODE[this.activePlayer - 1];
            do {
                numberColumn = playMode(this.activePlayer);
            } while (numberColumn > MAX_COLUMN || numberColumn <= 0 || board[0][numberColumn] === MAX_ROW)
            this.lastColumnInsert = numberColumn;
        },
        insertToken: function ({ board }) {
            board[0][this.lastColumnInsert]++;
            board[board[0][this.lastColumnInsert]][this.lastColumnInsert] = this.activePlayer;
        },
        setGameMode: function () {
            const GAME_MODE_NAMES = ["Jugador contra Jugador", "Jugador contra Computador", "Computador contra Computador"];
            let msg = (`\n----- 4inRow -----\ \n\nMODOS DE JUEGO`);
            for (let i = 0; i < GAME_MODE_NAMES.length; i++) {
                msg += `\n${i + 1}. ${GAME_MODE_NAMES[i]}`;
            }
            console.writeln(msg);
            const index = console.readNumber(`Elige un modo de juego (1, 2 o 3): `) - 1;
            return [[manual, manual], [manual, automatic], [automatic, automatic]][index];
        }
    };
    return returned;

    function manual(playerActive) {
        return console.readNumber(`jugador ${playerActive}, Escoge una columna (1-7)`);
    }
    function automatic() {
        const MAX_COLUMN = 8;
        return parseInt(Math.random() * MAX_COLUMN);
    }
}
function createPanel() {
    return {
        COL_AND_ROWS: 9,
        MAX_ROW: 7,
        MAX_COLUMN: 7,
        board: makeBoard(),
        resetBoard: function () {
            const VALUES = [0, 1, 2, 3];
            const BORDER = 8;
            for (let i = 0; i < this.COL_AND_ROWS; i++) {
                for (let j = 0; j < this.COL_AND_ROWS; j++) {
                    if (i == 1 || i == BORDER || j == 0 || j == BORDER) {
                        this.board[i][j] = VALUES[3];
                    } else if (i == 0) {
                        this.board[i][j] = VALUES[1];
                    } else {
                        this.board[i][j] = VALUES[0];
                    }
                }
            }
        },
        showBoard: function () {
            let msg = "";
            for (let i = this.COL_AND_ROWS - 1; i >= 0; i--) {
                for (let j = 0; j < this.COL_AND_ROWS; j++) {
                    msg += this.board[i][j] + " ";
                }
                msg += "\n";
            }
            console.writeln(`${player.plays} jugadas`);
            console.writeln(msg);
        }
    };
    function makeBoard() {
        board = new Array(this.COL_AND_ROWS);
        for (let i = 0; i < this.COL_AND_ROWS; i++) {
            board[i] = new Array(this.COL_AND_ROWS);
        }
        return board;
    }
}







