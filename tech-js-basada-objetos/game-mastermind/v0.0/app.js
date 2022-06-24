const { Console } = require("console-mpds");
const console = new Console();

playMasterMind();

function playMasterMind() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    let game = initGame();
    do {
      getValidProposedCombination(game);
      rateProposedCombination(game);
      showBoard(game);
    } while (!isGameOver(game));

    function initGame() {
      let game = {
        colors: `rgbcmy`,
        maxAttempts: 10,
        combinationLength: 4,
        secretCombination: ``,
        proposedCombination: ``,
        totalAttempts: 0,
        boardAttempts: ``,
        isTheWinner: false,
        errorMessages: {},
      };
      game.secretCombination = generateSecretCombination(
        game.colors,
        game.combinationLength
      );
      game.errorMessages = {
        combinationLength: `-> Longitud incorrecta de la combinación propuesta, debe ser de ${game.secretCombination.length} caracteres.`,
        repeatedColor: `-> Combinación propuesta incorrecta, al menos, un color está repetido.`,
        validColors: `-> Colores incorrectos, deben ser: ${game.colors}.`,
      };
      console.writeln(`\n----- MASTERMIND -----`);
      showBoard(game);
      return game;
    }

    function generateSecretCombination(colors, combinationLength) {
      let secretCombination = ``;
      for (let i = 0; i < combinationLength; i++) {
        let randomColor;
        do {
          randomColor = colors[parseInt(Math.random() * colors.length)];
          colorIsIncluded = includesColor(secretCombination, randomColor);
        } while (colorIsIncluded);
        secretCombination += randomColor;
      }
      return secretCombination;
    }

    function includesColor(colorsCombination, color) {
      for (let i = 0; i < colorsCombination.length; i++) {
        if (colorsCombination[i] === color) {
          return true;
        }
      }
      return false;
    }

    function showBoard({ totalAttempts, boardAttempts, secretCombination }) {
      console.writeln(
        `\n${totalAttempts} intento(s):\n${generateSecretCombinationStars()}${boardAttempts}`
      );

      function generateSecretCombinationStars() {
        let stars = "";
        for (let i = 0; i < secretCombination.length; i++) {
          stars += "*";
        }
        return stars;
      }
    }

    function getValidProposedCombination(game) {
      let isWrongProposedCombination;
      do {
        game.proposedCombination = console.readString(
          `Propón una combinación: `
        );
        let errors = checkErrorsInProposedCombination(
          game.proposedCombination,
          game.colors,
          game.secretCombination,
          game.errorMessages
        );
        isWrongProposedCombination = errors.length > 0;
        if (isWrongProposedCombination) {
          showErrorMessages(errors);
        }
      } while (isWrongProposedCombination);
      game.totalAttempts++;
    }

    function checkErrorsInProposedCombination(
      proposedCombination,
      colors,
      secretCombination,
      errorMessages
    ) {
      let errors = [];
      if (!checkCombinationLength(proposedCombination, secretCombination))
        errors[errors.length] = errorMessages.combinationLength;
      if (!checkNoRepeatColorInCombination(proposedCombination))
        errors[errors.length] = errorMessages.repeatedColor;
      if (!checkValidColorsInCombination(proposedCombination, colors))
        errors[errors.length] = errorMessages.validColors;
      return errors;

      function checkCombinationLength(proposedCombination, secretCombination) {
        return proposedCombination.length === secretCombination.length;
      }

      function checkNoRepeatColorInCombination(proposedCombination) {
        let isRepeatedColor = false;
        for (
          let i = 0;
          !isRepeatedColor && i < proposedCombination.length;
          i++
        ) {
          for (
            let j = i + 1;
            !isRepeatedColor && j < proposedCombination.length;
            j++
          ) {
            isRepeatedColor = proposedCombination[j] === proposedCombination[i];
          }
        }
        return !isRepeatedColor;
      }

      function checkValidColorsInCombination(proposedCombination, colors) {
        for (let i = 0; i < proposedCombination.length; i++) {
          if (!includesColor(colors, proposedCombination[i])) {
            return false;
          }
        }
        return true;
      }
    }

    function showErrorMessages(errors) {
      for (let i = 0; i < errors.length; i++) {
        console.writeln(errors[i]);
      }
    }

    function rateProposedCombination(game) {
      let blackTokens = 0;
      let whiteTokens = 0;
      for (let i = 0; i < game.secretCombination.length; i++) {
        if (game.proposedCombination[i] === game.secretCombination[i]) {
          blackTokens++;
        } else if (
          includesColor(game.secretCombination, game.proposedCombination[i])
        ) {
          whiteTokens++;
        }
      }
      if (game.proposedCombination === game.secretCombination) {
        game.isTheWinner = true;
      }
      updateBoardAttempts(game.proposedCombination, [blackTokens, whiteTokens]);

      function updateBoardAttempts(proposedCombination, scoreTokens) {
        let [blackTokens, whiteTokens] = scoreTokens;
        game.boardAttempts += `\n${proposedCombination} --> ${blackTokens} negra(s) y ${whiteTokens} blanca(s)`;
      }
    }

    function isGameOver(game) {
      if (game.isTheWinner || game.totalAttempts === game.maxAttempts) {
        proclaimWinnerOrLoser(game.isTheWinner);
        return true;
      } else if (!game.isTheWinner && game.totalAttempts < game.maxAttempts) {
        return false;
      }

      function proclaimWinnerOrLoser(isTheWinner) {
        if (isTheWinner) {
          console.writeln(`\n¡¡Has ganado!! ¡Enhorabuena!`);
        } else {
          console.writeln(
            `\n¡¡Has perdido!! Sobrepasaste tu límite de intentos.`
          );
        }
      }
    }
  }

  function isResumed() {
    let result;
    let error = false;
    do {
      let answer = console.readString(`¿Quieres seguir jugando? (s/n)`);
      result = answer === `s`;
      error = !result && answer !== `n`;
      if (error) {
        console.writeln(`Por favor, responde "s" o "n"`);
      }
    } while (error);
    return result;
  }
}
