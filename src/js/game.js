import { shuffle } from "./util";
import cards from "./cards";
import { generateSectionsList, generateSection, clearMain, generateStarsContainer } from "./generateLayout";
import Timer from "./timer";
import Stat from "./stat";

const path = "./";
const className = 'word-card';
const delay = 3;

class GameLogicClass {
    constructor() {
        this.wordsCount = 0;
        this.clearGameResults();
    }

    IsGameStarted() {
        return document.querySelector("#starting-game__checkbox").checked;
    }

    getMain() {
        return document.querySelector('main');
    }

    clearGameResults() {
        this.gameResults = {
            correctWords: 0,
            incorrectWords: 0,
        };
    }

    getWordsCount() {
        return this.wordsCount;
    }

    getAllCardsInSection(arr) {
        return arr.map((element) =>
            document.querySelector(`#${className}__${element.word}`)
        )
    }

    addStar(isCorrect) {
        const star = document.createElement('img');
        star.setAttribute('src', isCorrect ? './img/star-win.svg' : './img/star.svg');
        document.querySelector(isCorrect ? '.correct-stars' : '.incorrect-stars').appendChild(star);
    }

    onCardClicked(isCorrect) {
        if (isCorrect) {
            new Audio(`${path}audio/correct.mp3`).play();
            this.addStar(isCorrect);
            this.gameResults.correctWords++;
        } else {
            new Audio(`${path}audio/error.mp3`).play();
            this.addStar(isCorrect);
            this.gameResults.incorrectWords++;
        }

        this.wordsCount--;
        this.correctCard.classList.add(`${className}--hide-all-content`);
        this.section.pop();
        const _cards = this.getAllCardsInSection(this.section);
        this.correctCard = _cards[this.wordsCount - 1];
        this.gameInProcess();
    }

    setClickForCards(_cards) {
        _cards.forEach((element) => {
            element.addEventListener('click', (e) => {
                if (element == GameLogic.correctCard)
                    GameLogic.onCardClicked(true);
                else
                    GameLogic.onCardClicked(false);
            })
        })
    }

    createRepeatButton() {
        const main = this.getMain();
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('repeat-button-container');
        const repeatButton = document.createElement('img');
        repeatButton.setAttribute('src', './img/repeat.svg');
        repeatButton.addEventListener('click', () => {
            this.voiceWord()
        })

        buttonContainer.appendChild(repeatButton);
        main.appendChild(buttonContainer);
    }

    startGame(checkbox) {
        if (!this.IsGameStarted() || checkbox) {
            document.body.style["background-color"] = "#00bf82";
            document.querySelector("#starting-game__checkbox").checked = true;
            this.startGameLogic();
        }
    }

    startGameLogic() {
        document.querySelectorAll(`.${className}`).forEach((element) => {
            element.classList.add(`${className}--hide-content`);
        })
        if (this.getMain().section) {
            this.preparingToGame();
            Timer.startTimer(delay);
        }
    }

    preparingToGame() {
        const section = this.getSection();
        this.wordsCount = section.length;
        shuffle(section);
        this.section = section;
        this.correctCard = null;

        const _cards = this.getAllCardsInSection(this.section);
        const cardsCount = this.getWordsCount();
        const correctCard = _cards[cardsCount - 1]
        this.correctCard = correctCard;
        this.setClickForCards(_cards);
        this.createRepeatButton();
        }

    voiceWord() {
        const cardInfo = GameLogic.section[GameLogic.getWordsCount() - 1]
        new Audio(`${path}/${cardInfo.audioSrc}`).play();
    }

    gameInProcess() {
        if (GameLogic.getWordsCount() <= 1) {
            GameLogic.finishGameLogic();
            return;
        }
        GameLogic.voiceWord();
    }

    finishGameLogic() {
        Stat.writeStat(this.getMain().sectionName, this.gameResults);
        clearMain();
        const success = this.gameResults.correctWords >=
            this.gameResults.incorrectWords
        if (success) {
            new Audio(`${path}audio/success.mp3`).play();
            document.querySelector('.main__win').style["display"] = "flex";
        }
        this.correctCard = null;
        this.clearGameResults();
        setTimeout(generateSectionsList, success ? 3000 : 1);
    }

    getSection() {
        const sectionName = this.getMain().sectionName;
        let sectionArray;
        cards[0].forEach((element, index) => {
            if (element == sectionName) sectionArray = [...cards[index + 1]];
        })
        return sectionArray;
    }

    endGameLogic() {
        document.querySelectorAll(`.${className}`).forEach((element) => {
            element.classList.remove(`${className}--hide-content`);
        })
        Timer.removeTimer();
        const sectionName = this.getMain().sectionName;
        if (this.section)
            generateSection(this.section, sectionName);
    }

    interruptGame(checkbox) {
        if (this.IsGameStarted() || checkbox) {
            document.body.style["background-color"] = "white";
            document.querySelector("#starting-game__checkbox").checked = false;
            this.endGameLogic();
        }
    }
}

const GameLogic = new GameLogicClass();

document.querySelector(".pretty").addEventListener("click", function (event) {
    if (GameLogic.IsGameStarted()) {
        document.body.style["background-color"] = "#00bf82";
        GameLogic.startGame(true);
    } else {
        document.body.style["background-color"] = "white";
        GameLogic.interruptGame(true);
    }
})

export default GameLogic;