const { Console } = require("console-mpds");
const console = new Console();

const masterMindView = initMasterMindView();
masterMindView.play();

function initMasterMindView() {
  return {
    continueDialog: initYesNoDialog(`¿Quieres seguir jugando? (s|n) `),
    play() {
      do {
        const gameView = initGameView();
        gameView.play();
        this.continueDialog.read();
      } while (this.continueDialog.isAffirmative());
    },
  };
}

function initYesNoDialog(question) {
  let that = {
    question: question,
    answer: ``,
  };

  return {
    read() {
      let error = false;
      do {
        that.answer = console.readString(that.question);
        error = !this.isAffirmative() && !this.isNegative();
        if (error) {
          console.writeln(`Por favor, responde "s" o "n"`);
        }
      } while (error);
    },

    isAffirmative() {
      return that.answer === `s`;
    },

    isNegative() {
      return that.answer === `n`;
    },
  };
}

function initGameView() {
  const game = initGame();
  let that = {
    start() {
      console.writeln(`\n----- MASTERMIND -----`);
      this.show();
    },
    setProposedCombination() {
      const proposedCombination =
        initProposedCombinationView().setValidProposal();
      game.add(proposedCombination.getColors());
    },
    show() {
      console.writeln(
        `\n${
          game.getProposedCombinations().length
        } intento(s):\n${game.getStars()}`
      );
      for (let proposalColors of game.getProposedCombinations()) {
        const result = game.getResult(proposalColors);
        // console.writeln(`${proposalColors} --> ${result.show()}`);

        initProposedCombinationView().show(proposalColors);
        initResultView().show(result);
      }
    },
    proclaimWinnerOrLoser() {
      if (game.isTheWinner()) {
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
      } while (!game.isGameOver());
      that.proclaimWinnerOrLoser();
    },
  };
}

function initGame() {
  let that = {
    secretCombination: initSecretCombination(),
    maxAttempts: 10,
    proposedCombinations: [],

    getLastResult() {
      return this.secretCombination.getResult(
        this.lastProposedCombinationColors()
      );
    },
    lastProposedCombinationColors() {
      return this.proposedCombinations[this.proposedCombinations.length - 1];
    },
    isTheLoser() {
      return this.proposedCombinations.length === this.maxAttempts;
    },
  };
  that.secretCombination.generate();

  return {
    add(colors) {
      that.proposedCombinations[that.proposedCombinations.length] = colors;
    },
    getStars() {
      return that.secretCombination.stars;
    },
    getProposedCombinations() {
      return that.proposedCombinations;
    },
    getResult(proposalColors) {
      return that.secretCombination.getResult(proposalColors);
    },
    isGameOver() {
      return this.isTheWinner() || that.isTheLoser();
    },
    isTheWinner() {
      return that
        .getLastResult()
        .isTheWinner(that.lastProposedCombinationColors());
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

function initProposedCombinationView() {
  const proposedCombination = initProposedCombination();
  let that = {
    errorMessages: {
      combinationLength: `-> Longitud incorrecta de la combinación propuesta, debe ser de ${proposedCombination.getCombinationLength()} caracteres.`,
      repeatedColor: `-> Combinación propuesta incorrecta, al menos, un color está repetido.`,
      validColors: `-> Colores incorrectos, deben ser: ${proposedCombination.getColorsRange()}.`,
    },
    checkErrorsInProposal() {
      let errors = [];
      if (!proposedCombination.checkCombinationLength())
        errors[errors.length] = this.errorMessages.combinationLength;
      if (!proposedCombination.checkNoRepeatColorInCombination())
        errors[errors.length] = this.errorMessages.repeatedColor;
      if (!proposedCombination.checkValidColorsInCombination())
        errors[errors.length] = this.errorMessages.validColors;
      return errors;
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
        let proposalColors = console.readString(`Propón una combinación: `);
        proposedCombination.setColors(proposalColors);
        let errors = that.checkErrorsInProposal();
        isWrongProposal = errors.length > 0;
        if (isWrongProposal) {
          that.showErrorMessages(errors);
        }
      } while (isWrongProposal);
      return proposedCombination;
    },
    show(proposalColors) {
      console.write(proposalColors);
    },
  };
}

function initProposedCombination() {
  const combination = initCombination();
  return {
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
    setColors(colors) {
      combination.colors = colors;
    },
    getColors() {
      return combination.colors;
    },
    getCombinationLength() {
      return combination.lengthValue;
    },
    getColorsRange() {
      return combination.colorsRange;
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

function initResultView() {
  return {
    show(result) {
      console.writeln(
        ` --> ${result.getBlacks()} negra(s) y ${result.getWhites()} blanca(s)`
      );
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
    getBlacks() {
      return that.blacks;
    },
    getWhites() {
      return that.whites;
    },
    isTheWinner(colors) {
      return that.blacks === colors.length;
    },
  };
}
