const { Console } = require("console-mpds");
const console = new Console();

playMasterMind();

function playMasterMind() {
  let continueDialog = initYesNoDialog(`¿Quieres seguir jugando? (s|n) `);
  do {
    const game = initGame();
    game.play();
    continueDialog.read();
  } while (continueDialog.isAffirmative());

  function initGame() {
    return {
      colors: `rgbcmy`,
      maxAttempts: 10,
      combinationLength: 4,
      secretCombination: ``,
      proposedCombination: ``,
      totalAttempts: 0,
      boardAttempts: ``,
      isTheWinner: false,
      errorMessages: {},

      play: function () {
        this.start();
        do {
          this.getValidProposedCombination();
          this.rateProposedCombination();
          this.showBoard();
        } while (!this.isGameOver());
      },
      start: function () {
        this.generateSecretCombination();
        this.errorMessages = {
          combinationLength: `-> Longitud incorrecta de la combinación propuesta, debe ser de ${this.secretCombination.length} caracteres.`,
          repeatedColor: `-> Combinación propuesta incorrecta, al menos, un color está repetido.`,
          validColors: `-> Colores incorrectos, deben ser: ${this.colors}.`,
        };
        console.writeln(`\n----- MASTERMIND -----`);
        this.showBoard();
      },
      generateSecretCombination: function () {
        for (let i = 0; i < this.combinationLength; i++) {
          let randomColor;
          do {
            randomColor =
              this.colors[parseInt(Math.random() * this.colors.length)];
            colorIsIncluded = this.includesColor(
              this.secretCombination,
              randomColor
            );
          } while (colorIsIncluded);
          this.secretCombination += randomColor;
        }
      },
      includesColor: function (colorsCombination, color) {
        for (let i = 0; i < colorsCombination.length; i++) {
          if (colorsCombination[i] === color) {
            return true;
          }
        }
        return false;
      },
      showBoard: function () {
        console.writeln(
          `\n${
            this.totalAttempts
          } intento(s):\n${this.generateSecretCombinationStars()}${
            this.boardAttempts
          }`
        );
      },
      generateSecretCombinationStars: function () {
        let stars = "";
        for (let i = 0; i < this.secretCombination.length; i++) {
          stars += "*";
        }
        return stars;
      },
      getValidProposedCombination: function () {
        let isWrongProposedCombination;
        do {
          this.proposedCombination = console.readString(
            `Propón una combinación: `
          );
          let errors = this.checkErrorsInProposedCombination();
          isWrongProposedCombination = errors.length > 0;
          if (isWrongProposedCombination) {
            this.showErrorMessages(errors);
          }
        } while (isWrongProposedCombination);
        this.increaseAttempts();
      },
      increaseAttempts: function () {
        this.totalAttempts++;
      },
      checkErrorsInProposedCombination: function () {
        let errors = [];
        if (!this.checkCombinationLength())
          errors[errors.length] = this.errorMessages.combinationLength;
        if (!this.checkNoRepeatColorInCombination())
          errors[errors.length] = this.errorMessages.repeatedColor;
        if (!this.checkValidColorsInCombination())
          errors[errors.length] = this.errorMessages.validColors;
        return errors;
      },
      checkCombinationLength: function () {
        return (
          this.proposedCombination.length === this.secretCombination.length
        );
      },
      checkNoRepeatColorInCombination: function () {
        let isRepeatedColor = false;
        for (
          let i = 0;
          !isRepeatedColor && i < this.proposedCombination.length;
          i++
        ) {
          for (
            let j = i + 1;
            !isRepeatedColor && j < this.proposedCombination.length;
            j++
          ) {
            isRepeatedColor =
              this.proposedCombination[j] === this.proposedCombination[i];
          }
        }
        return !isRepeatedColor;
      },
      checkValidColorsInCombination: function () {
        for (let i = 0; i < this.proposedCombination.length; i++) {
          if (!this.includesColor(this.colors, this.proposedCombination[i])) {
            return false;
          }
        }
        return true;
      },
      showErrorMessages: function (errors) {
        for (let i = 0; i < errors.length; i++) {
          console.writeln(errors[i]);
        }
      },
      rateProposedCombination: function () {
        let blackTokens = 0;
        let whiteTokens = 0;
        for (let i = 0; i < this.secretCombination.length; i++) {
          if (this.proposedCombination[i] === this.secretCombination[i]) {
            blackTokens++;
          } else if (
            this.includesColor(
              this.secretCombination,
              this.proposedCombination[i]
            )
          ) {
            whiteTokens++;
          }
        }
        if (this.proposedCombination === this.secretCombination) {
          this.isTheWinner = true;
        }
        this.updateBoardAttempts([blackTokens, whiteTokens]);
      },
      updateBoardAttempts: function (scoreTokens) {
        let [blackTokens, whiteTokens] = scoreTokens;
        this.boardAttempts += `\n${this.proposedCombination} --> ${blackTokens} negra(s) y ${whiteTokens} blanca(s)`;
      },
      isGameOver: function () {
        if (this.isTheWinner || this.totalAttempts === this.maxAttempts) {
          this.proclaimWinnerOrLoser();
          return true;
        } else if (!this.isTheWinner && this.totalAttempts < this.maxAttempts) {
          return false;
        }
      },
      proclaimWinnerOrLoser() {
        if (this.isTheWinner) {
          console.writeln(`\n¡¡Has ganado!! ¡Enhorabuena!`);
        } else {
          console.writeln(
            `\n¡¡Has perdido!! Sobrepasaste tu límite de intentos.`
          );
        }
      },
    };
  }

  function initYesNoDialog(question) {
    return {
      question: question,
      answer: ``,

      read: function () {
        let error = false;
        do {
          answer = console.readString(this.question);
          error = !this.isAffirmative() && !this.isNegative();
          if (error) {
            console.writeln(`Por favor, responde "s" o "n"`);
          }
        } while (error);
      },

      isAffirmative: function () {
        return answer === `s`;
      },

      isNegative: function () {
        return answer === `n`;
      },
    };
  }
}
