const { Console } = require("console-mpds");
const console = new Console();



let pointsP1 = 0;
let pointsP2 = 0;
let pointsToWin;
const COMBLENGHT = 4;

do {
    pointsToWin = console.readNumber(`¿Cuantos puntos para ganar?(más de 0)`)
} while (pointsToWin < 1)

let board;
let player;
let secretCombination;
let acumPlayer = 0;
let points;

do {
    player = acumPlayer % 2 + 1;
    acumPlayer++;
    const MOVES = 10;
    board = [];
    points = 0;

    console.writeln(`\nJugador ${player}, Introduce la combinación a buscar`);
    secretCombination = setCombination();
    console.writeln(`\n\n\n Empezamos!`);
    let intentos = MOVES;

    for (let i = 0; !found() && i < MOVES * 2; i = i + 2) {
        points++;
        console.writeln(`Jugador ${player === 1 ? 2 : 1}--Adelante! ${intentos--} intentos restantes--`);
        toBoard(setCombination());
        paintBoard();
    }

    let messageOut = `Se acabaron los intentos. \n buscabamos ${secretCombination}`;
    if (found()) {
        messageOut = `Enhorabuena! encontraste la combinación.`;
    }
    console.writeln(messageOut);
    setShowPoints();



    if (pointsP1 >= pointsToWin || pointsP2 >= pointsToWin) {
        let go = console.readNumber(`Fin del juego, introduce 1 para jugar otra partida, otro número para salir`)
        reset(go == 1);
    }



} while (pointsP1 < pointsToWin && pointsP2 < pointsToWin)
console.writeln(`Hasta la próxima.`);


/*funciones*/
function setShowPoints() {
    if (player === 1) {
        pointsP1 += points;
    } else {
        pointsP2 += points;
    }
    let showPoints = `Objetivo; ${pointsToWin} puntos.\nEl jugador ${player} ha conseguido ${points} puntos.\n\tjugador 1: ${pointsP1} puntos.\n\tjugador 2: ${pointsP2} puntos.`
    console.writeln(showPoints);
}
function reset(option) {
    if (option) {
        pointsP1 = 0;
        pointsP2 = 0;
        acumPlayer = 0;
        do {
            pointsToWin = console.readNumber(`¿Cuantos puntos para ganar?(más de 0)`)
        } while (pointsToWin < 1)
    }

}
function found() {
    let result = true;
    if (board.length == 0) {
        return false;
    } else {

        for (let item of board[board.length - 1]) {
            result &&= item === "Negro";
        }
    }
    return result;
}

function paintBoard() {
    console.writeln(`\n\t************`);
    for (let row of board) {
        console.writeln(row);
    }
    console.writeln(`\t************`);
}

function toBoard(lastPlay) {

    board[board.length] = lastPlay;
    checkLastPlay();


    function checkLastPlay() {
        const RCOLORS = ["Nada", "Blanco", "Negro", "Encontrada"]

        let response = [RCOLORS[0], RCOLORS[0], RCOLORS[0], RCOLORS[0]];
        let copySecret = []
        for (i in secretCombination) {
            copySecret[i] = secretCombination[i];
        }
        for (j in copySecret) {
            if (copySecret[j] === lastPlay[j]) {
                response[j] = RCOLORS[2];
                copySecret[j] = RCOLORS[3];
            }
        }
        for (i in lastPlay) {
            let found = false;
            for (let j = 0; !found && j < COMBLENGHT; j++) {
                if (lastPlay[i] === copySecret[j] && response[i] != RCOLORS[2]) {
                    copySecret[j] = RCOLORS[3];
                    response[i] = RCOLORS[1];
                    found = true;
                }
            }
        }
        board[board.length] = response;
    }

}


function setCombination() {
    const COLORS = ["Rojo", "Verde", "Azul", "Amarillo", "Cyan", "Magenta"];

    let showColors = "";
    let combination = [];
    let color;

    legend();
    for (let i = 0; i < COMBLENGHT; i++) {

        do {
            color = console.readNumber(`introduce el color ${i + 1}: `);
        } while (color < 0 || color > 5)
        combination[i] = COLORS[color];
        showColors += combination[i] + " ";
        console.writeln(showColors);
    }
    return combination;

    function legend() {
        let message = ``;
        for (let i in COLORS) {

            let separator = ", "
            if (i == COLORS.length - 2) {
                separator = ` y `;
            } else if (i == COLORS.length - 1) {
                separator = "";
            }
            message += `${i} para ${COLORS[i]}${separator}`;
        }
        console.writeln(message);
    }
}
/*Nota personal-Alberto- para acceder a una variable del programa desde una función la variable ha de ser accesible desde donde
declaramos la función, no desde donde llamamos a la función*/