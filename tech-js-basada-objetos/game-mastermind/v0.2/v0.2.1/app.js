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
    let that = {
      maxAttempts: 10,
      secretCombination: initSecretCombination(initCombination),
      proposedCombination: initProposedCombination(initCombination),
      result: initResult(),

      start() {
        this.secretCombination.generate();
        console.writeln(`\n----- MASTERMIND -----`);
        this.result.show(this.proposedCombination, this.secretCombination);
      },
      isGameOver() {
        if (this.secretCombination.isTheWinner || this.isTheLoser()) {
          this.proclaimWinnerOrLoser();
          return true;
        } else if (!this.secretCombination.isTheWinner && this.continues()) {
          return false;
        }
      },
      isTheLoser() {
        return this.proposedCombination.totalAttempts === this.maxAttempts;
      },
      continues() {
        return this.proposedCombination.totalAttempts < this.maxAttempts;
      },
      proclaimWinnerOrLoser() {
        if (this.secretCombination.isTheWinner) {
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
          that.secretCombination.rateProposal(
            that.proposedCombination,
            that.result
          );
          that.result.show(that.proposedCombination, that.secretCombination);
        } while (!that.isGameOver());
      },
    };
  }

  function initCombination() {
    return {
      colors: `rgbcmy`,
      theLength: 4,
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

  function initSecretCombination(combination) {
    combination = combination();
    let that = {
      getRandomColor(colors) {
        return colors[parseInt(Math.random() * colors.length)];
      },
      updateAttempts(proposedCombination, blackTokens, whiteTokens) {
        proposedCombination.attempts += `\n${proposedCombination.theProposal} --> ${blackTokens} negra(s) y ${whiteTokens} blanca(s)`;
      },
    };

    return {
      theSecret: ``,
      stars: ``,
      isTheWinner: false,

      generate() {
        for (let i = 0; i < combination.theLength; i++) {
          let randomColor;
          do {
            randomColor = that.getRandomColor(combination.colors);
            colorIsIncluded = combination.includesColor(
              this.theSecret,
              randomColor
            );
          } while (colorIsIncluded);
          this.theSecret += randomColor;
          this.stars += `*`;
        }
      },
      rateProposal(proposedCombination, result) {
        let [blackTokens, whiteTokens] = result.calculate(
          this,
          proposedCombination,
          combination
        );
        that.updateAttempts(proposedCombination, blackTokens, whiteTokens);
      },
    };
  }

  function initProposedCombination(combination) {
    combination = combination();
    let that = {
      errorMessages: {
        combinationLength: `-> Longitud incorrecta de la combinación propuesta, debe ser de ${combination.theLength} caracteres.`,
        repeatedColor: `-> Combinación propuesta incorrecta, al menos, un color está repetido.`,
        validColors: `-> Colores incorrectos, deben ser: ${combination.colors}.`,
      },
      checkErrorsInProposal(theProposal) {
        let errors = [];
        if (!this.checkCombinationLength(theProposal))
          errors[errors.length] = this.errorMessages.combinationLength;
        if (!this.checkNoRepeatColorInCombination(theProposal))
          errors[errors.length] = this.errorMessages.repeatedColor;
        if (!this.checkValidColorsInCombination(theProposal))
          errors[errors.length] = this.errorMessages.validColors;
        return errors;
      },
      checkCombinationLength(theProposal) {
        return theProposal.length === combination.theLength;
      },
      checkNoRepeatColorInCombination(theProposal) {
        let isRepeatedColor = false;
        for (let i = 0; !isRepeatedColor && i < theProposal.length; i++) {
          for (let j = i + 1; !isRepeatedColor && j < theProposal.length; j++) {
            isRepeatedColor = theProposal[j] === theProposal[i];
          }
        }
        return !isRepeatedColor;
      },
      checkValidColorsInCombination(theProposal) {
        for (let i = 0; i < theProposal.length; i++) {
          if (!combination.includesColor(combination.colors, theProposal[i])) {
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
      theProposal: ``,
      totalAttempts: 0,
      attempts: ``,
      setValidProposal() {
        let isWrongProposal;
        do {
          this.theProposal = console.readString(`Propón una combinación: `);
          let errors = that.checkErrorsInProposal(this.theProposal);
          isWrongProposal = errors.length > 0;
          if (isWrongProposal) {
            that.showErrorMessages(errors);
          }
        } while (isWrongProposal);
        this.increaseAttempts();
      },
      increaseAttempts() {
        this.totalAttempts++;
      },
    };
  }

  function initResult() {
    return {
      show(proposedCombination, secretCombination) {
        console.writeln(
          `\n${proposedCombination.totalAttempts} intento(s):\n${secretCombination.stars}${proposedCombination.attempts}`
        );
      },
      calculate(secretCombination, proposedCombination, combination) {
        let blackTokens = 0;
        let whiteTokens = 0;
        for (let i = 0; i < secretCombination.theSecret.length; i++) {
          if (
            proposedCombination.theProposal[i] ===
            secretCombination.theSecret[i]
          ) {
            blackTokens++;
          } else if (
            combination.includesColor(
              secretCombination.theSecret,
              proposedCombination.theProposal[i]
            )
          ) {
            whiteTokens++;
          }
        }
        if (proposedCombination.theProposal === secretCombination.theSecret) {
          secretCombination.isTheWinner = true;
        }

        return [blackTokens, whiteTokens];
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
}
