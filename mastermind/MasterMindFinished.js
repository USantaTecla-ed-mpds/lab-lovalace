const { Console } = require("console-mpds");
const console = new Console();
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
    const COLORS = ["r", "g", "y", "b", "m", "c"]
    const SecretCombination = changeIndexToColors(getIndexCombination(random));
    const MOVES = 10;
    let intentos = MOVES;
    let proposedBoard = [];
    let responseBoard = [];
    let messageOut = "";
    for (let i = 0; !found(responseBoard) && i < MOVES; i++) {
        console.writeln(`--Adelante! ${intentos--} intentos restantes--`);
        let proposedCombination = changeIndexToColors(getIndexCombination(manual));
        console.writeln(proposedCombination);
        const response = responseCombination(proposedCombination, SecretCombination);
        saveInBoard(proposedBoard, proposedCombination);
        saveInBoard(responseBoard, response);
        printBoard(proposedBoard, responseBoard);
        messageOut = winMessage(response);
    }
    console.writeln(messageOut);
    function found(board) {
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
    function winMessage(lastResponse) {
        let response = lastResponse;
        let result = true;
        for (let item of response) {
            result &&= item === "Negro";
        }
        if (result) {
            return `has ganado!`;
        } else {
            return `has perdido, se acabaron los intentos`;
        }
    }
    function printBoard(proposedB, responseB) {
        let message = "\n***\n";
        for (i = 0; i < proposedB.length; i++) {
            message += `${proposedB[i][0]}${proposedB[i][1]}${proposedB[i][2]}${proposedB[i][3]} -->  ${writeResponseToString(responseB[i])}\n`
        }
        console.writeln(message);
        function writeResponseToString(response) {
            let array = response;
            let countWhite = 0;
            let countBlack = 0;
            for (let color of array) {
                if (color === "Blanco") {
                    countWhite++;
                } else if (color === "Negro") {
                    countBlack++;
                }
            }
            return `${countBlack} negros y ${countWhite} blancos`;
        }
    }
    function saveInBoard(board, combination) {
        board[board.length] = combination;
    }
    function responseCombination(proposed, secret) {
        const RESPONSECOLORS = ["Nada", "Blanco", "Negro"];
        let response = [RESPONSECOLORS[0], RESPONSECOLORS[0], RESPONSECOLORS[0], RESPONSECOLORS[0]]
        for (i in proposed) {
            let sameColor = false;
            for (secretItem of secret) {
                sameColor ||= proposed[i] === secretItem;
            }
            if (sameColor) {
                response[i] = RESPONSECOLORS[1];
            }
        }
        for (j in secret) {
            if (secret[j] === proposed[j]) {
                response[j] = "Negro";
            }
        }
        return response;
    }
    function showLegend(arrayCol) {
        const COLORS = arrayCol;
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
    function getIndexCombination(f) {
        let combination = [];
        const combinationLength = 4;
        const COLORSLength = 6;
        let anIndexColor;
        while (combination.length < combinationLength) {
            anIndexColor = f(combination.length + 1);//lo llamo akiiii
            if (combination.length == 0 && anIndexColor >= 0 && anIndexColor < COLORSLength) {
                combination[combination.length] = anIndexColor;
            }
            let repeated = false;
            for (i = 0; i < combination.length; i++) {
                repeated ||= anIndexColor == combination[i];
            }
            if (!repeated && anIndexColor >= 0 && anIndexColor < COLORSLength) {
                combination[combination.length] = anIndexColor;
            }
        }
        return combination;
    }
    function manual(count) {
        showLegend(COLORS);
        return console.readNumber(`introduce el color ${count}: `);
    }
    function random() {
        return parseInt(Math.random() * 6);
    }
    function changeIndexToColors(indexArray) {
        const COLORS = ["r", "g", "y", "b", "m", "c"]
        const index = indexArray;
        let colorsArray = []
        for (i = 0; i < index.length; i++) {
            colorsArray[colorsArray.length] = COLORS[index[i]];
        }
        return colorsArray;
    }
}