const { Console } = require("console-mpds");
const console = new Console();
do {
    playGame();
} while (isResumed())

function isResumed() {
    let resume = console.readString(`quieres continuar? (y/n):`);
    return resume[0] === "y";
}
function playGame() {
    const MOVES = 10;
    let game = initGame(MOVES);
    getSecretCombination(game);
    do {
        console.writeln(game.SECRET_COMBINATION);
        console.writeln(`--Adelante! ${game.attempts--} intentos restantes--`);
        getProposedCombination(game);
        game.proposedBoard[game.proposedBoard.length] = game.proposedCombination;
        printBoard(game);

    } while (!found(game["proposedCombination"], game["SECRET_COMBINATION"]) && game.attempts > 0)
    writeEndGame(game.proposedCombination, game.SECRET_COMBINATION);

    function initGame(MOVES) {
        let object = {};
        object.COLORS = ["r", "g", "y", "b", "m", "c"];
        object.COMBINATION_LENGTH = 4;
        object.attempts = MOVES;
        object.proposedBoard = [];
        object.proposedCombination = [];
        return object;
    }
    function getSecretCombination(game) {
        let indexCombination = [];
        let indexColor;
        while (indexCombination.length < game.COMBINATION_LENGTH) {
            indexColor = parseInt(Math.random() * game.COLORS.length);
            if (indexCombination.length === 0) {
                indexCombination[indexCombination.length] = indexColor;
            } else {
                let repeated = false;
                for (let i = 0; i < indexCombination.length; i++) {
                    repeated ||= indexColor === indexCombination[i];
                }
                if (!repeated) {
                    indexCombination[indexCombination.length] = indexColor;
                }
            }
        }
        let colorsArray = [];
        for (let i = 0; i < indexCombination.length; i++) {
            colorsArray[colorsArray.length] = game.COLORS[indexCombination[i]];
        }
        game.SECRET_COMBINATION = colorsArray;
    }
    function getProposedCombination(game) {
        let error;
        let proposedArray = [];
        do {
            error = false;
            console.writeln(`Los colores son ${game.COLORS}`);
            let proposedString = console.readString(`Introduce ${game.COMBINATION_LENGTH} colores`);
            error = proposedString.length != game.COMBINATION_LENGTH;
            if (error) {
                console.writeln(`Error, cantidad de colores incorrecta.`);
            }
            if (!error) {
                error = checkRepeated(proposedString);
                if (error) {
                    console.writeln(`Error, colores repetidos.`);
                }
            }
            if (!error) {
                let validColor = true;
                for (let i = 0; validColor && i < game.COMBINATION_LENGTH; i++) {
                    validColor = checkValidsColors(proposedString[i], game.COLORS);
                }
                if (!validColor) {
                    console.writeln(`Error, color desconocido.`);
                }
                error = !validColor;
            }
            if (!error) {
                proposedArray = changeStringToArray(proposedString, game.COMBINATION_LENGTH);//
            }
        } while (error)
        game.proposedCombination = proposedArray;

        function checkValidsColors(color, arrayColors) {
            let colorFound = false;
            for (let i = 0; !colorFound && i < arrayColors.length; i++) {
                colorFound = color === arrayColors[i];
            }
            return colorFound;
        }
        function checkRepeated(proposedString) {
            let repeated = false;
            for (let i = 0; !repeated && i < proposedString.length - 1; i++) {
                for (let j = i + 1; !repeated && j < proposedString.length; j++) {
                    repeated = proposedString[i] === proposedString[j];
                }
            }
            return repeated;
        }
        function changeStringToArray(string) {
            let proposedArray = [];
            for (let i = 0; i < string.length; i++) {
                proposedArray[i] = string[i];
            }
            return proposedArray;
        }
    }
    function found(proposed, secret) {
        let result = true;
        for (let i in proposed) {
            result &&= proposed[i] === secret[i];
        }
        return result;
    }
    function writeEndGame(proposed, secret) {
        let result = true;
        for (let i in proposed) {
            result &&= proposed[i] === secret[i];
        }
        if (result) {
            console.writeln(`has ganado!`);
        } else {
            console.writeln(`has perdido, se acabaron los intentos`);
        }
    }
    function printBoard({ proposedBoard, SECRET_COMBINATION }) {
        let message = "\n***\n";
        for (let proposed of proposedBoard) {
            message += `${writeProposed(proposed)} --> ${writeResponse(proposed, SECRET_COMBINATION)}\n`;
        }
        console.writeln(message);

        function writeProposed(proposed) {
            let proposedLine = "";
            for (let color of proposed) {
                proposedLine += color;
            }
            return proposedLine;
        }
        function writeResponse(proposed, secret) {
            let whitesAndBlacks = 0;
            for (let proposedColor of proposed) {
                let sameColor = false;
                for (let secretColor of secret) {
                    sameColor ||= proposedColor === secretColor;
                }
                if (sameColor) {
                    whitesAndBlacks++;
                }
            }
            let blacks = 0;
            for (let i in secret) {
                if (secret[i] === proposed[i]) {
                    blacks++;
                }
            }
            let whites = whitesAndBlacks - blacks
            return `${blacks} negros y ${whites} blancos`;
        }
    }
}
