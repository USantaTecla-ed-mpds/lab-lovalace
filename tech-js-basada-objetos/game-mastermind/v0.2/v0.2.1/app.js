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
      for (let proposalColors of this.proposedCombinations) {
        const result = this.secretCombination.getResult(proposalColors);
        console.writeln(`${proposalColors} --> ${result.show()}`);
        this.result = result;
      }
    },
    setProposedCombination() {
      const proposedCombination = initProposedCombination();
      proposedCombination.setValidProposal();
      this.add(proposedCombination.getColors());
    },
    add(colors) {
      this.proposedCombinations[this.proposedCombinations.length] = colors;
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
        that.setProposedCombination();
        that.show();
      } while (!that.isGameOver());
    },
  };
}

function initCombination() {
  return {
    colorsRange: `rgbcmy`,
    lengthValue: 4,
    colors: ``,
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
    stars: ``,

    generate() {
      for (let i = 0; i < combination.lengthValue; i++) {
        let randomColor;
        do {
          randomColor = that.getRandomColor(combination.colorsRange);
          colorIsIncluded = combination.includesColor(
            combination.colors,
            randomColor
          );
        } while (colorIsIncluded);
        combination.colors += randomColor;
        this.stars += `*`;
      }
    },
    getResult(colors) {
      const result = initResult();
      for (let i = 0; i < combination.colors.length; i++) {
        if (colors[i] === combination.colors[i]) {
          result.increaseBlacks();
        } else if (combination.includesColor(combination.colors, colors[i])) {
          result.increaseWhites();
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
    checkErrorsInProposal() {
      let errors = [];
      if (!this.checkCombinationLength())
        errors[errors.length] = this.errorMessages.combinationLength;
      if (!this.checkNoRepeatColorInCombination())
        errors[errors.length] = this.errorMessages.repeatedColor;
      if (!this.checkValidColorsInCombination())
        errors[errors.length] = this.errorMessages.validColors;
      return errors;
    },
    checkCombinationLength() {
      return combination.colors.length === combination.lengthValue;
    },
    checkNoRepeatColorInCombination() {
      let isRepeatedColor = false;
      for (let i = 0; !isRepeatedColor && i < combination.colors.length; i++) {
        for (
          let j = i + 1;
          !isRepeatedColor && j < combination.colors.length;
          j++
        ) {
          isRepeatedColor = combination.colors[j] === combination.colors[i];
        }
      }
      return !isRepeatedColor;
    },
    checkValidColorsInCombination() {
      for (let i = 0; i < combination.colors.length; i++) {
        if (
          !combination.includesColor(
            combination.colorsRange,
            combination.colors[i]
          )
        ) {
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
    setValidProposal() {
      let isWrongProposal;
      do {
        combination.colors = console.readString(`Propón una combinación: `);
        let errors = that.checkErrorsInProposal();
        isWrongProposal = errors.length > 0;
        if (isWrongProposal) {
          that.showErrorMessages(errors);
        }
      } while (isWrongProposal);
    },
    getColors() {
      return combination.colors;
    },
  };
}

function initResult() {
  let that = {
    blacks: 0,
    whites: 0,
  };

  return {
    increaseBlacks() {
      that.blacks++;
    },
    increaseWhites() {
      that.whites++;
    },
    show() {
      return `${that.blacks} negra(s) y ${that.whites} blanca(s)`;
    },
    isTheWinner(colors) {
      return that.blacks === colors.length;
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
