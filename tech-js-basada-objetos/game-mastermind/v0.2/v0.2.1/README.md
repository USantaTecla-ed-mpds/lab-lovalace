# game-mastermind v0.2.1

* [Diagrama de Clases](#classDiagram)
* [plantUML](#plantUML)

## Diagrama de Clases

![Imagen del Diagrama de Clases](./UML/v0.2.1-mastermind-uml.png)

## plantUML

```text
@startuml

class MasterMind {
  +YesNoDialog continueDialog
  +void play()
}

class YesNoDialog {
  -String question
  -String answer
  +void read()
  +Boolean isAffirmative()
  +Boolean isNegative()
}

class Game {
  -SecretCombination secretCombination
  -Int maxAttempts
  -String[] proposedCombinations
  -void start()
  -void show()
  -void setProposedCombination()
  -void add(String colors)
  -Boolean isGameOver()
  -Boolean isTheWinner()
  -Result getResult()
  -String lastProposedCombinationColors()
  -Boolean isTheLoser()
  -void proclaimWinnerOrLoser()
  +void play()
}

class SecretCombination {
  -Combination combination
  +String stars
  -String getRandomColor(String colorsRange)
  +void generate()
  +Result getResult(String colors)
}

class ProposedCombination {
  -Combination combination
  -errorMessages
  -checkErrorsInProposal()
  -Boolean checkCombinationLength()
  -Boolean checkNoRepeatColorInCombination()
  -Boolean checkValidColorsInCombination()
  -void showErrorMessages(errors)
  +void setValidProposal()
  +String getColors()
}

class Combination {
  +String colorsRange
  +Int lengthValue
  +String colors
  +Boolean includesColor(colorsCombination, color)
}

class Result {
  -Int blacks
  -Int whites
  +void increaseBlacks()
  +void increaseWhites()
  +void show()
  +Boolean isTheWinner(String colors)
}

MasterMind .down.> Game
MasterMind .down.> YesNoDialog
Game *-down-> SecretCombination : parte
Game o-down-> ProposedCombination : agrega
Game .left.> Result
SecretCombination .up.> Result : usa
SecretCombination .right.> ProposedCombination
SecretCombination -down-> Combination : asociado
ProposedCombination -down-> Combination : asociado

@enduml
```
