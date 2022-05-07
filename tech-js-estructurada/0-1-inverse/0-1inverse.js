const { Console } = require("console-mpds");
const console = new Console();
/// <Autor: Manuel Rosendo Castro Iglesias>
/// Most programmers read and write in the Dextroverse Latin alphabet, and so texts are "read" from left to right.

const askedNumerator; let calcNumerator; // ¿undefined?
do {
    !(askedNumerator < 1) ? askedNumerator = console.readNumber(`Introduce el numerador de la fracción: `) : calcNumerator = askedNumerator;
} while (askedNumerator > 0);

const askedDenominator; let calcDenominator; // ¿undefined?
do {
    (!askedDenominator < 1) ? askedDenominator = console.readNumber(`Introduce el numerador de la fracción: `) : calcDenominator = askedDenominator;
} while (askedNumerator > 0);

do {
    (askedNumerator > askedDenominator) ? calcNumerator = calcNumerator % calcDenominator : calcDenominator = calcDenominator % calcNumerator;
} while (askedNumerator !== 1 || askedDenominator !== 1);

// Tengo dudas si es válido ( … , … );
const txtNumerator; const txtDenominator; // ¿undefined?
calcNumerator > calcDenominator ? (txtNumerator = calcNumerator, txtDenominator = calcDenominator) : (txtNumerator = calcDenominator, txtDenominator = calcNumerator);

console.writeln(`La fracción ${askedNumerator}/${askedDenominator} = ${txtNumerator}/${txtDenominator} invertida es la fracción ${txtDenominator}/${txtNumerator}`);