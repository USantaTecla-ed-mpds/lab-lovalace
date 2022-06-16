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
    const COLORS = ["r", "g", "y", "b", "m", "c"];
    const COMBINATION_LENGTH = 4;
    const SECRET_COMBINATION = getSecretCombination(COMBINATION_LENGTH, COLORS);
    console.writeln(SECRET_COMBINATION);
    const MOVES = 10;
    let attempts = MOVES;
    let proposedBoard = [];
    let messageOut = "";
    let proposedCombination = [];
    do {
        console.writeln(`--Adelante! ${attempts--} intentos restantes--`);
        proposedCombination = getProposedCombination(COLORS, COMBINATION_LENGTH);
        proposedBoard[proposedBoard.length] = proposedCombination;
        printBoard(proposedBoard, SECRET_COMBINATION);
        messageOut = winMessage(proposedCombination, SECRET_COMBINATION);
    } while (!found(proposedCombination, SECRET_COMBINATION) && attempts > 0)
    console.writeln(messageOut);

    function getSecretCombination(combinationLength, colors) {
        let indexCombination = [];
        let indexColor;
        while (indexCombination.length < combinationLength) {
            indexColor = parseInt(Math.random() * colors.length);
            if (indexCombination.length == 0) {
                indexCombination[indexCombination.length] = indexColor;
            } else {
                let repeated = false;
                for (let i = 0; i < indexCombination.length; i++) {
                    repeated ||= indexColor == indexCombination[i];
                }
                if (!repeated) {
                    indexCombination[indexCombination.length] = indexColor;
                }
            }
        }
        let colorsArray = [];
        for (let i = 0; i < indexCombination.length; i++) {
            colorsArray[colorsArray.length] = COLORS[indexCombination[i]];
        }
        return colorsArray;
    }
    function getProposedCombination(arrayColors, combinationLength) {
        let error;
        let proposedArray = [];
        do {
            error = false;
            console.writeln(`Los colores son ${arrayColors}`);
            let proposedString = console.readString(`Introduce ${combinationLength} colores`);
            error = proposedString.length != combinationLength;
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
                for (let i = 0; validColor && i < combinationLength; i++) {
                    validColor = checkValidsColors(proposedString[i], arrayColors);
                }
                if (!validColor) {
                    console.writeln(`Error, color desconocido.`);
                }
                error = !validColor;
            }
            if (!error) {
                proposedArray = changeStringToArray(proposedString, combinationLength);
            }
        } while (error)
        return proposedArray;

        function checkValidsColors(color, arrayColors) {
            let colorFound = false;
            for (let i = 0; !colorFound && i < arrayColors.length; i++) {
                colorFound = color === arrayColors[i];
            }
            return colorFound;
        }
        function checkRepeated(proposedString) {
            let repeated = false;
            for (let i = 0; !repeated && i < proposedString.length-1; i++) {
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
    function winMessage(proposed, secret) {
        let result = true;
        for (let i in proposed) {
            result &&= proposed[i] === secret[i];
        }
        if (result) {
            return `has ganado!`;
        } else {
            return `has perdido, se acabaron los intentos`;
        }
    }
    function printBoard(proposedBoard, secret) {
        let message = "\n***\n";
        for (let proposed of proposedBoard) {
            message += `${writeProposed(proposed)} --> ${writeResponse(proposed, secret)}\n`;
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
            return `${blacks} negros y ${whites} blancos`
        }
    }
}
