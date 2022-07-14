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
  let that = {
    secretCombination: initSecretCombination(),
    maxAttempts: 10,
    proposedCombination: initProposedCombination(),
    totalAttempts: 0,
    attempts: ``,

    start() {
      this.secretCombination.generate();
      console.writeln(`\n----- MASTERMIND -----`);
      this.show();
    },
    show() {
      console.writeln(
        `\n${this.totalAttempts} intento(s):\n${this.secretCombination.stars}${this.attempts}`
      );
    },
    result: ``,
    updateAttempts() {
      this.totalAttempts++;
      this.result = this.secretCombination.getResult(this.proposedCombination);
      this.attempts += `\n${this.proposedCombination.colors} --> ${this.result.blacks} negra(s) y ${this.result.whites} blanca(s)`;
    },
    isGameOver() {
      if (
        this.result.isTheWinner(this.proposedCombination.colors) ||
        this.isTheLoser()
      ) {
        this.proclaimWinnerOrLoser();
        return true;
      }
      return false;
    },
    isTheLoser() {
      return this.totalAttempts === this.maxAttempts;
    },
    proclaimWinnerOrLoser() {
      if (this.result.isTheWinner(this.proposedCombination.colors)) {
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
        that.proposedCombination.setValidProposal();
        that.updateAttempts();
        that.show();
      } while (!that.isGameOver());
    },
  };
}

function initCombination() {
  return {
    colorsRange: `rgbcmy`,
    lengthValue: 4,
    // colors: ``,
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
  combination = initCombination();
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
    getResult(proposedCombination) {
      const result = initResult();
      for (let i = 0; i < this.colors.length; i++) {
        if (proposedCombination.colors[i] === this.colors[i]) {
          result.blacks++;
        } else if (
          combination.includesColor(this.colors, proposedCombination.colors[i])
        ) {
          result.whites++;
        }
      }
      return result;
    },
  };
}

function initProposedCombination() {
  combination = initCombination();
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

    isTheWinner(proposedCombination) {
      return this.blacks === proposedCombination.length;
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
