//board[fila][columna]--Alberto--
const { Console } = require("console-mpds");
const console = new Console();

create4InRow().play();

function create4InRow() {
    return {
        play: function () {
            const continueDialogView = askToContinueView(`¿Quieres jugar otra vez? `);
            do {
                const game = createGame();
                game.run();
                continueDialogView.read();
            } while (continueDialogView.isAffirmative())
        }
    }
}
function askToContinueView(question) {
    let answer;
    return {
        read: function () {
            let error;
            do {
                answer = console.readString(question);
                error = !this.isAffirmative() && !this.isNegative();
                if (error) {
                    console.writeln(`Por favor, responda "si" o "no"`);
                }
            } while (error);
        },
        isAffirmative: function () {
            return answer === `si`;
        },
        isNegative: function () {
            return answer === `no`;
        }
    }
}
function createGame() {
    return {
        panel: createPanel(),
        panelView: createPanelView(),
        players: createPlayers(),
        playersView: createPlayersView(),
        run: function () {
            let plays = 0;
            this.panelView.showSquares(plays, this.panel);
            let win = false;
            let activePlayer;
            let activeMode;
            do {
                activePlayer = this.players.changeActivePlayer(plays);
                activeMode = this.playersView.changeActiveMode(plays);
                plays++;
                let column;
                do {
                    column = this.playersView.chooseColumn(activeMode, activePlayer);
                } while (!this.panel.checkValidColumn(column));
                let row = this.panel.firstEmptyRow(column);
                let lastToken = { row, column };
                this.panel.insertToken(lastToken, activePlayer);
                this.panelView.showSquares(plays, this.panel);
                win = this.panel.isWiner(lastToken, activePlayer);
            } while (!win && !this.panel.tie(plays))
            this.panelView.endGameMessage(activePlayer, win);
        }
    };
    function createPanelView() {
        return {
            showSquares: function (plays, panel) {
                let msg = "";
                for (let i = panel.ROWS_LENGTH - 1; i >= 0; i--) {
                    for (let j = 0; j < panel.COLUMNS_LENGTH; j++) {
                        msg += panel.squares[i][j] + " ";
                    }
                    msg += "\n";
                }
                console.writeln(`${plays} jugadas`);
                console.writeln(msg);
            },
            endGameMessage: function (activePlayer, win) {
                if (win) {
                    console.writeln(`El jugador ${activePlayer} ha ganado la partida.`);
                } else {
                    console.writeln(`Empate, tablero lleno.`);
                }
            },
        };
    }
    function createPlayersView() {
        return {
            PLAYERS_MODE: setGameMode(),//devería estar en players? no se como hacerlo sin que la vista conozca al controlador
            changeActiveMode: function (plays) {
                return this.PLAYERS_MODE[plays % 2];
            },
            chooseColumn: function (activeMode, activePlayer) {
                return activeMode(activePlayer);
            },
        };
        function setGameMode() {
            const PLAYERS_MODE_OPTIONS = ["Jugador contra Jugador", "Jugador contra Computador", "Computador contra Computador"];
            let msg = (`\n----- 4inRow -----\ \n\nMODOS DE JUEGO`);
            for (let i = 0; i < PLAYERS_MODE_OPTIONS.length; i++) {
                msg += `\n${i + 1}. ${PLAYERS_MODE_OPTIONS[i]}`;
            }
            console.writeln(msg);
            let index;
            do {
                index = console.readNumber(`Elige un modo de juego (1, 2 o 3): `) - 1;
            } while (index != 0 && index != 1 && index != 2);
            return [[manual, manual], [manual, automatic], [automatic, automatic]][index];
        }
        function manual(activePlayer) {
            return console.readNumber(`jugador ${activePlayer}, Escoge una columna (0-6)`);
        }
        function automatic() {
            const COLUMNS_LENGTH = 7;
            return parseInt(Math.random() * COLUMNS_LENGTH);
        }
    }
    function createPlayers() {
        return {
            PLAYERS: [1, 2],
            changeActivePlayer: function (plays) {
                return this.PLAYERS[plays % 2];
            }
        };
    }
    function createPanel() {
        return {
            squares: makeSquares(),
            ROWS_LENGTH: 6,
            COLUMNS_LENGTH: 7,
            checkValidColumn: function (column) {
                return column < this.COLUMNS_LENGTH && column >= 0 && this.squares[this.ROWS_LENGTH - 1][column] == 0;
            },
            firstEmptyRow: function (column) {
                let found;
                let row;
                for (i = 0; !found || i > this.ROWS_LENGTH; i++) {
                    row = i;
                    found = this.squares[i][column] == 0;
                }
                return row;
            },
            insertToken: function (lastToken, activePlayer) {
                this.squares[lastToken.row][lastToken.column] = activePlayer;
            },
            tie: function (plays) {
                MAX_TOKENS = this.ROWS_LENGTH * this.COLUMNS_LENGTH;
                return MAX_TOKENS === plays;
            },
            isWiner: function (lastToken, activePlayer) {
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
                    goal = tokensToLeft.countSameTokens(lastToken, activePlayer, this) + 1 + tokensToRight.countSameTokens(lastToken, activePlayer, this) >= 4
                }
                return goal;
            }
        };
        
        function createVector({ rowMove, columnMove }) {
            return {
                countSameTokens: function (lastToken, activePlayer, panel) {
                    let exit = false;
                    let count = 0;
                    let row = lastToken.row;
                    let column = lastToken.column;
                    do {
                        row = row + rowMove;
                        column = column + columnMove;
                        if (row < 0 || column < 0 || row >= panel.ROWS_LENGTH || column >= panel.COLUMNS_LENGTH) {
                            exit = true;
                        } else if (panel.squares[row][column] == activePlayer) {
                            count++;
                        } else {
                            exit = true;
                        }
                    } while (!exit)
                    return count;
                }
            };
        }
        function makeSquares() {
            const ROWS_LENGTH = 6;
            const COLUMNS_LENGTH = 7;
            let squares;
            squares = new Array(ROWS_LENGTH);
            for (let i = 0; i < ROWS_LENGTH; i++) {
                squares[i] = new Array(COLUMNS_LENGTH);
            }
            resetSquares(ROWS_LENGTH, COLUMNS_LENGTH, squares);
            return squares;
        }
        function resetSquares(ROWS_LENGTH, COLUMNS_LENGTH, squares) {
            for (let i = 0; i < ROWS_LENGTH; i++) {
                for (let j = 0; j < COLUMNS_LENGTH; j++) {
                    squares[i][j] = 0;                   
                }
            }
        }
    }
}



