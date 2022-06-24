const { Console } = require("console-mpds");
const console = new Console();

playMasterMind();

function playMasterMind() {
  do {
    playGame();
  } while (isResumed());

  function playGame() {
    const COLORS = `rgbcmy`;
    const MAX_ATTEMPTS = 10;
    const COMBINATION_LENGTH = 4;
    const SECRET_COMBINATION = generateSecretCombination(
      COLORS,
      COMBINATION_LENGTH
    );
    let totalAttempts = 0;
    let boardAttempts = ``;
    let isTheWinner = false;
    console.writeln(`\n----- MASTERMIND -----`);
    showBoard(totalAttempts, boardAttempts, SECRET_COMBINATION);
    do {
      let proposedCombination = getValidProposedCombination(
        COLORS,
        SECRET_COMBINATION
      );
      totalAttempts++;
      let attemptResult = rateProposedCombination(
        proposedCombination,
        SECRET_COMBINATION
      );
      isTheWinner = attemptResult[0];
      let [blackTokens, whiteTokens] = attemptResult[1];
      boardAttempts += `\n${proposedCombination} --> ${blackTokens} negra(s) y ${whiteTokens} blanca(s)`;
      showBoard(totalAttempts, boardAttempts, SECRET_COMBINATION);
    } while (!isGameOver(isTheWinner, totalAttempts, MAX_ATTEMPTS));

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

    function showBoard(totalAttempts, boardAttempts, secretCombination) {
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

    function getValidProposedCombination(colors, secretCombination) {
      let isWrongProposedCombination;
      do {
        proposedCombination = console.readString(`Propón una combinación: `);
        let errors = checkErrorsInProposedCombination(
          proposedCombination,
          colors,
          secretCombination
        );
        isWrongProposedCombination = errors.length > 0;
        if (isWrongProposedCombination) {
          showErrorMessages(errors);
        }
      } while (isWrongProposedCombination);
      return proposedCombination;
    }

    function checkErrorsInProposedCombination(
      proposedCombination,
      colors,
      secretCombination
    ) {
      let errors = [];
      const ERROR_MESSAGES = [
        `-> Longitud incorrecta de la combinación propuesta, debe ser de ${secretCombination.length} caracteres.`,
        `-> Combinación propuesta incorrecta, al menos, un color está repetido.`,
        `-> Colores incorrectos, deben ser: ${colors}.`,
      ];
      if (!checkCombinationLength(proposedCombination, secretCombination))
        errors[errors.length] = ERROR_MESSAGES[0];
      if (!checkNoRepeatColorInCombination(proposedCombination))
        errors[errors.length] = ERROR_MESSAGES[1];
      if (!checkValidColorsInCombination(proposedCombination, colors))
        errors[errors.length] = ERROR_MESSAGES[2];
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

    function rateProposedCombination(proposedCombination, secretCombination) {
      let blackTokens = 0;
      let whiteTokens = 0;
      for (let i = 0; i < secretCombination.length; i++) {
        if (proposedCombination[i] === secretCombination[i]) {
          blackTokens++;
        } else if (includesColor(secretCombination, proposedCombination[i])) {
          whiteTokens++;
        }
      }
      if (proposedCombination === secretCombination) {
        return [true, [blackTokens, whiteTokens]];
      }
      return [false, [blackTokens, whiteTokens]];
    }

    function isGameOver(isTheWinner, totalAttempts, maxAttempts) {
      if (isTheWinner || totalAttempts === maxAttempts) {
        proclaimWinnerOrLoser(isTheWinner);
        return true;
      } else if (!isTheWinner && totalAttempts < maxAttempts) {
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
