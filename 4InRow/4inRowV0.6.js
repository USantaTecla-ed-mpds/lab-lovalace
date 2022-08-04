//board[fila][columna]--Alberto--
//--PARA CUALQUIERA QUE LEA ESTE CÓDIGO--Comenta que cambiarías del mismo ()
const { Console } = require("console-mpds");
const console = new Console();
const askToContinue = () => console.readString(`quieres continuar? (y/n):`)[0] === "y";
do {
    const game = createGame();
    game.run();
} while (askToContinue())

function createGame() {
    return {
        panel: createPanel(),
        panelView: createPanelView(),
        player: createPlayer(),
        playerView: createPlayerView(),
        run: function () {
            let plays = 0;
            let activeToken;
            let win = false;
            let MIN_TOKENS_TO_WIN = 7;
            this.player.setGameMode(this.playerView);
            this.panel.makeSquares();
            this.panelView.showSquares(plays, this.panel);
            do {
                activeToken = this.player.changeActivePlayer(plays);
                plays++;
                let lastToken = this.player.chooseValidColumn(this.panel, this.playerView, activeToken);
                this.panel.insertToken(lastToken, activeToken);
                this.panelView.showSquares(plays, this.panel);
                if (plays >= MIN_TOKENS_TO_WIN) {
                    win = this.panel.isWiner(lastToken, activeToken, this.panel);
                }
            } while (!win || this.panel.tie(plays))
            this.panelView.endGameMessage(activeToken, win);
        }
    };
    function createPanelView() {
        return {
            showSquares: function (plays, { COLUMNS_LENGTH, ROWS_LENGTH, squares }) {
                let msg = "";
                for (let i = ROWS_LENGTH - 1; i >= 0; i--) {
                    for (let j = 0; j < COLUMNS_LENGTH; j++) {
                        msg += squares[i][j] + " ";
                    }
                    msg += "\n";
                }
                console.writeln(`${plays} jugadas`);
                console.writeln(msg);
            },
            endGameMessage: function (activeToken, win) {
                if (win) {
                    console.writeln(`El jugador ${activeToken} ha ganado la partida.`);
                } else {
                    console.writeln(`Empate, tablero lleno.`);
                }
            },
        };
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
    function createPlayer() {
        return {
            GAME_MODE: null,
            changeActivePlayer: function (plays) {
                return plays % 2 + 1;
            },
            chooseValidColumn: function (panel, playerView, activeToken) {
                const AUTOMATIC_OR_MANUAL = this.GAME_MODE[activeToken - 1];
                let column;
                do {
                    column = AUTOMATIC_OR_MANUAL(panel.COLUMNS_LENGTH, activeToken, playerView);
                } while (!checkValidColumn(panel, column))
                let row = firstEmptyRow(panel, column);
                return { row, column };
            },
            setGameMode: function (playerView) {
                playerView.showGameMode();
                const index = playerView.setNumber(`Elige un modo de juego (1, 2 o 3): `) - 1;
                this.GAME_MODE = [[manual, manual], [manual, automatic], [automatic, automatic]][index];
            }
        };
        function firstEmptyRow({ squares, ROWS_LENGTH }, column) {
            let found;
            let row;
            for (i = 0; !found || i > ROWS_LENGTH; i++) {
                row = i;
                found = squares[i][column] == 0;
            }
            return row;
        }
        function checkValidColumn({ COLUMNS_LENGTH, ROWS_LENGTH, squares }, numberColumn) {
            return numberColumn < COLUMNS_LENGTH && numberColumn >= 0 && squares[ROWS_LENGTH - 1][numberColumn] == 0;
        }
        function manual(a, activeToken, playerView) {
            return playerView.setNumber(`jugador ${activeToken}, Escoge una columna (0-6)`);
        }
        function automatic(COLUMNS_LENGTH) {
            return parseInt(Math.random() * COLUMNS_LENGTH);
        }
    }
    function createPanel() {
        return {
            squares: null,
            ROWS_LENGTH: 6,
            COLUMNS_LENGTH: 7,
            insertToken: function ({ row, column }, activeToken) {
                squares[row][column] = activeToken;
            },
            tie: function (plays) {
                MAX_TOKENS = this.ROWS_LENGTH * this.COLUMNS_LENGTH;
                return MAX_TOKENS == plays;
            },
            makeSquares: function () {
                squares = new Array(this.ROWS_LENGTH);
                for (let i = 0; i < this.ROWS_LENGTH; i++) {
                    squares[i] = new Array(this.COLUMNS_LENGTH);
                }
                resetSquares(this.ROWS_LENGTH, this.COLUMNS_LENGTH);
                this.squares = squares;
            },
            isWiner: function (lastToken, activeToken, panel) {
                const INIT_VECTORS =
                    [{ rowMove: -1, columnMove: 0 }, { rowMove: 1, columnMove: 0 },
                    { rowMove: 0, columnMove: 1 }, { rowMove: 0, columnMove: -1 },
                    { rowMove: -1, columnMove: -1 }, { rowMove: 1, columnMove: 1 },
                    { rowMove: -1, columnMove: 1 }, { rowMove: 1, columnMove: -1 }
                    ]
                let goal = false;
                for (let i = 0; !goal && i <= INIT_VECTORS.length - 2; i = i + 2) {
                    const tokensToLeft = createVector(INIT_VECTORS[i]);
                    const tokensToRight = createVector(INIT_VECTORS[i + 1]);
                    goal = tokensToLeft.countSameTokens(lastToken, activeToken, panel) + 1 + tokensToRight.countSameTokens(lastToken, activeToken, panel) >= 4
                }
                return goal;
            }
        };
        function createVector({ rowMove, columnMove }) {
            return {
                rowMove: rowMove,//no hace falta, la función puede coger los valores de la cabecera de createVector, que se aconseja?
                columnMove: columnMove,//esto tampoco hace falta
                //countSameTokens podría ser una función libre pero sobrecargaría la cabecera
                countSameTokens: function ({ row, column }, activeToken, { squares, ROWS_LENGTH, COLUMNS_LENGTH }) {
                    let exit = false;
                    let count = 0;
                    do {
                        row = row + this.rowMove;//quitando el this. coge los datos de la cabecera de createvector
                        column = column + this.columnMove;
                        if (row < 0 || column < 0 || row >= ROWS_LENGTH || column >= COLUMNS_LENGTH) {
                            exit = true;
                        } else if (squares[row][column] == activeToken) {
                            count++;
                        } else {
                            exit = true;
                        }
                    } while (!exit)
                    return count;
                }
            };
        }
        function resetSquares(ROWS_LENGTH, COLUMNS_LENGTH) {
            for (let i = 0; i < ROWS_LENGTH; i++) {
                for (let j = 0; j < COLUMNS_LENGTH; j++) {
                    squares[i][j] = 0;
                }
            }
        }
    }
}



