const { Console } = require("console-mpds");
const console = new Console();

const masterMind = initMasterMind();
masterMind.play();

function initMasterMind() {
  return {
    continueDialog: initYesNoDialog(`¿Quieres seguir jugando? (s|n) `),
    play() {
      do {
        const game = initGame();
        game.play();
        this.continueDialog.read();
      } while (this.continueDialog.isAffirmative());
    },
  };
}

function initGame() {
  const proposedCombination = initProposedCombination();
  let that = {
    secretCombination: initSecretCombination(),
    maxAttempts: 10,
    proposedCombinations: [],
    result: ``,

    start() {
      this.secretCombination.generate();
      console.writeln(`\n----- MASTERMIND -----`);
      this.show();
    },
    show() {
      console.writeln(
        `\n${this.proposedCombinations.length} intento(s):\n${this.secretCombination.stars}`
      );
      for (let colors of this.proposedCombinations) {
        const result = this.secretCombination.getResult(colors);
        console.writeln(
          `${colors} --> ${result.blacks} negra(s) y ${result.whites} blanca(s)`
        );
        this.result = result;
      }
    },
    add(proposedCombination) {
      this.proposedCombinations[this.proposedCombinations.length] =
        proposedCombination.colors;
    },
    isGameOver() {
      if (
        this.result.isTheWinner(this.lastProposedCombinationColors()) ||
        this.isTheLoser()
      ) {
        this.proclaimWinnerOrLoser();
        return true;
      }
      return false;
    },
    lastProposedCombinationColors() {
      return this.proposedCombinations[this.proposedCombinations.length - 1];
    },
    isTheLoser() {
      return this.proposedCombinations.length === this.maxAttempts;
    },
    proclaimWinnerOrLoser() {
      if (this.result.isTheWinner(this.lastProposedCombinationColors())) {
        console.writeln(`\n¡¡Has ganado!! ¡Enhorabuena!`);
      } else {
        console.writeln(
          `\n¡¡Has perdido!! Sobrepasaste tu límite de intentos.`
        );
      }
    },
  };
  that.start();

  return {
    play() {
      do {
        proposedCombination.setValidProposal();
        that.add(proposedCombination);
        that.show();
      } while (!that.isGameOver());
    },
  };
}

function initCombination() {
  return {
    colorsRange: `rgbcmy`,
    lengthValue: 4,
    //colors: ``,
    includesColor(colorsCombination, color) {
      for (let i = 0; i < colorsCombination.length; i++) {
        if (colorsCombination[i] === color) {
          return true;
        }
      }
      return false;
    },
  };
}

function initSecretCombination() {
  const combination = initCombination();
  let that = {
    getRandomColor(colorsRange) {
      return colorsRange[parseInt(Math.random() * colorsRange.length)];
    },
  };

  return {
    colors: ``,
    stars: ``,

    generate() {
      for (let i = 0; i < combination.lengthValue; i++) {
        let randomColor;
        do {
          randomColor = that.getRandomColor(combination.colorsRange);
          colorIsIncluded = combination.includesColor(this.colors, randomColor);
        } while (colorIsIncluded);
        this.colors += randomColor;
        this.stars += `*`;
      }
    },
    getResult(colors) {
      const result = initResult();
      for (let i = 0; i < this.colors.length; i++) {
        if (colors[i] === this.colors[i]) {
          result.blacks++;
        } else if (combination.includesColor(this.colors, colors[i])) {
          result.whites++;
        }
      }
      return result;
    },
  };
}

function initProposedCombination() {
  const combination = initCombination();
  let that = {
    errorMessages: {
      combinationLength: `-> Longitud incorrecta de la combinación propuesta, debe ser de ${combination.lengthValue} caracteres.`,
      repeatedColor: `-> Combinación propuesta incorrecta, al menos, un color está repetido.`,
      validColors: `-> Colores incorrectos, deben ser: ${combination.colorsRange}.`,
    },
    checkErrorsInProposal(colors) {
      let errors = [];
      if (!this.checkCombinationLength(colors))
        errors[errors.length] = this.errorMessages.combinationLength;
      if (!this.checkNoRepeatColorInCombination(colors))
        errors[errors.length] = this.errorMessages.repeatedColor;
      if (!this.checkValidColorsInCombination(colors))
        errors[errors.length] = this.errorMessages.validColors;
      return errors;
    },
    checkCombinationLength(colors) {
      return colors.length === combination.lengthValue;
    },
    checkNoRepeatColorInCombination(colors) {
      let isRepeatedColor = false;
      for (let i = 0; !isRepeatedColor && i < colors.length; i++) {
        for (let j = i + 1; !isRepeatedColor && j < colors.length; j++) {
          isRepeatedColor = colors[j] === colors[i];
        }
      }
      return !isRepeatedColor;
    },
    checkValidColorsInCombination(colors) {
      for (let i = 0; i < colors.length; i++) {
        if (!combination.includesColor(combination.colorsRange, colors[i])) {
          return false;
        }
      }
      return true;
    },
    showErrorMessages(errors) {
      for (let i = 0; i < errors.length; i++) {
        console.writeln(errors[i]);
      }
    },
  };

  return {
    colors: ``,
    setValidProposal() {
      let isWrongProposal;
      do {
        this.colors = console.readString(`Propón una combinación: `);
        let errors = that.checkErrorsInProposal(this.colors);
        isWrongProposal = errors.length > 0;
        if (isWrongProposal) {
          that.showErrorMessages(errors);
        }
      } while (isWrongProposal);
    },
  };
}

function initResult() {
  return {
    blacks: 0,
    whites: 0,

    isTheWinner(colors) {
      return this.blacks === colors.length;
    },
  };
}

function initYesNoDialog(question) {
  return {
    question: question,
    answer: ``,

    read() {
      let error = false;
      do {
        answer = console.readString(this.question);
        error = !this.isAffirmative() && !this.isNegative();
        if (error) {
          console.writeln(`Por favor, responde "s" o "n"`);
        }
      } while (error);
    },

    isAffirmative() {
      return answer === `s`;
    },

    isNegative() {
      return answer === `n`;
    },
  };
}
