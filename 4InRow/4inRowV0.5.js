//board[fila][columna]--Alberto-- La fila 0 contiene el indice de la última fila usada de la columna, cambiarlo por una función .


const { Console } = require("console-mpds");
const console = new Console();
const ROWS_AND_COLUMNS = 9;
const askToContinue = () => console.readString(`quieres continuar? (y/n):`)[0] === "y";
do {
    const play = createPlay(ROWS_AND_COLUMNS);
    play.run();
} while (askToContinue())
function createPlay(ROWS_AND_COLUMNS) {
    return {
        panel: createPanel(ROWS_AND_COLUMNS),
        panelView: createPanelView(),
        player: createPlayer(),
        playerView: createPlayerView(),
        winner: createWinner(),
        winnerView: createWinnerView(),
        run: function () {
            this.player.setGameMode(this.playerView);
            this.panel.resetBoard();
            this.panelView.showBoard(this.player, this.panel);

            do {
                this.player.changeActivePlayer();
                this.player.chooseValidColumn(this.panel, this.playerView);
                this.player.insertToken(this.panel);
                this.panelView.showBoard(this.player, this.panel);
            } while (!this.winner.finishGame(this.player, this.panel.board))
            this.winnerView.endGameMessage(this.player, this.winner);
        }
    };
    function createPanelView() {
        return {
            showBoard: function ({ plays }, { COL_AND_ROWS, board }) {
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
        };
    }
    function createWinnerView() {
        return {
            endGameMessage: function ({ activePlayer }, { win }) {
                if (win) {
                    console.writeln(`El jugador ${activePlayer} ha ganado la partida.`);
                } else {
                    console.writeln(`Empate, tablero lleno.`);
                }
            },
        }
    }
    function createPlayerView() {
        return {
            setNumber: function (message) {
                return console.readNumber(message);
            },
            showGameMode: function () {
                const GAME_MODE_NAMES = ["Jugador contra Jugador", "Jugador contra Computador", "Computador contra Computador"];
                let msg = (`\n----- 4inRow -----\ \n\nMODOS DE JUEGO`);
                for (let i = 0; i < GAME_MODE_NAMES.length; i++) {
                    msg += `\n${i + 1}. ${GAME_MODE_NAMES[i]}`;
                }
                console.writeln(msg);
            }
        };
    }
    function createWinner() {
        return {
            win: false,
            finishGame: function ({ plays, lastColumnInsert }, board) {
                this.win = winGame(plays, lastColumnInsert, board);
                return this.win || filledBoard(plays);
            }
        };
        function filledBoard(plays) {
            const MAX_TOKENS = 42;
            return plays === MAX_TOKENS;
        }
        function winGame(plays, lastColumnInsert, board) {
            const SHORTEST_WIN = 7;
            let win;
            const MIN_TOKENS_TO_WIN = 4;
            if (plays < SHORTEST_WIN) {
                win = false;
            } else {
                let row = board[0][lastColumnInsert];
                win = false;
                const checks = [checkVertical, checkHorizontal, checkDiagonalUp, checkDiagonalDown];
                for (let i = 0; !win && i < checks.length; i++) {
                    win = MIN_TOKENS_TO_WIN <= checks[i](board, lastColumnInsert, row);
                }
            }
            return win;
        }
        function checkDiagonalUp(board, column, row) {
            return checkDiagonalUpLeft(board, column, row) + checkDiagonalUpRight(board, column, row);
        }
        function checkDiagonalDown(board, column, row) {
            return checkDiagonalDownLeft(board, column, row) + checkDiagonalDownRight(board, column, row);
        }
        function checkHorizontal(board, column, row) {
            return checkHorizontalLeft(board, column, row) + checkHorizontalRight(board, column, row);
        }
        function checkDiagonalDownRight(board, column, row) {
            let same = true;
            let acum = 1;
            for (let i = row, j = column; same; i--, j++) {
                if (board[i][j] == board[i - 1][j + 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            return acum;
        }
        function checkDiagonalDownLeft(board, column, row) {
            let same = true;
            let acum = 0;
            for (let i = row, j = column; same; i++, j--) {
                if (board[i][j] == board[i + 1][j - 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            return acum;
        }
        function checkDiagonalUpRight(board, column, row) {

            let same = true;
            let acum = 1;
            for (let i = row, j = column; same; i++, j++) {
                if (board[i][j] == board[i + 1][j + 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            return acum;
        }
        function checkDiagonalUpLeft(board, column, row) {
            let same = true;
            let acum = 0;
            for (let i = row, j = column; same; i--, j--) {
                if (board[i][j] == board[i - 1][j - 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            return acum;
        }
        function checkHorizontalRight(board, column, row) {
            let same = true;
            let acum = 1;
            for (let i = column; same; i++) {
                if (board[row][i] == board[row][i + 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            return acum;
        }
        function checkHorizontalLeft(board, column, row) {
            let same = true;
            let acum = 0;
            for (let i = column; same; i--) {
                if (board[row][i] == board[row][i - 1]) {
                    acum++;
                } else {
                    same = false;
                }
            }
            return acum;
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
            return acum;
        }
    }
    function createPlayer() {
        return {
            GAME_MODE: null,
            plays: 0,
            lastColumnInsert: 0,
            activePlayer: 0,
            changeActivePlayer: function () {
                this.activePlayer = this.plays % 2 + 1;
                this.plays++;
            },
            chooseValidColumn: function ({ MAX_COLUMN, MAX_ROW, board }, playerView) {
                let numberColumn;
                const playMode = this.GAME_MODE[this.activePlayer - 1];
                do {
                    numberColumn = playMode(this.activePlayer, playerView);
                } while (numberColumn > MAX_COLUMN || numberColumn <= 0 || board[0][numberColumn] === MAX_ROW)
                this.lastColumnInsert = numberColumn;
            },
            insertToken: function ({ board }) {
                board[0][this.lastColumnInsert]++;
                board[board[0][this.lastColumnInsert]][this.lastColumnInsert] = this.activePlayer;
            },
            setGameMode: function (playerView) {
                playerView.showGameMode();
                const index = playerView.setNumber(`Elige un modo de juego (1, 2 o 3): `) - 1;
                this.GAME_MODE = [[manual, manual], [manual, automatic], [automatic, automatic]][index];
            }
        };
        function manual(playerActive, playerView) {
            return playerView.setNumber(`jugador ${playerActive}, Escoge una columna (1-7)`);
        }
        function automatic() {
            const MAX_COLUMN = 8;
            return parseInt(Math.random() * MAX_COLUMN);
        }
    }
    function createPanel(ROWS_AND_COLUMNS) {
        return {
            COL_AND_ROWS: ROWS_AND_COLUMNS,
            MAX_ROW: 7,
            MAX_COLUMN: 7,
            board: makeBoard(ROWS_AND_COLUMNS),
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
            }
        };
        function makeBoard(COL_AND_ROWS) {
            board = new Array(COL_AND_ROWS);
            for (let i = 0; i < COL_AND_ROWS; i++) {
                board[i] = new Array(COL_AND_ROWS);
            }
            return board;
        }
    }
}



