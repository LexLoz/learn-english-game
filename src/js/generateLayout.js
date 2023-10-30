import cards from "./cards.js";
import GameLogic from "./game.js";
import Stat from "./stat.js";

const path = "./";

function createCard(img, text, isSection, audioSrc) {
    const div = document.createElement("div");
    div.classList.add("card");
    div.addEventListener('mouseover', () => {
        div.classList.toggle('card__zoom');
    });
    div.addEventListener('mouseleave', () => {
        div.classList.remove('card__zoom');
    });

    const image = document.createElement("img");
    image.setAttribute("src", `${path}/${img}`);
    image.setAttribute("alt", text);

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    if (isSection) {
        div.classList.add("section-card");
        div.appendChild(image);
        div.appendChild(paragraph);
    } else {
        const className = "word-card";
        div.classList.add(className);
        // const wrapper = document.createElement("div");
        const card_front = document.createElement("div");
        const card_back = document.createElement("div");
        // wrapper.classList.add(className + '__wrapper');
        card_front.classList.add(className + "__front");
        card_back.classList.add(className + "__back");

        const paragraph_rus = document.createElement("p");
        paragraph_rus.textContent = text.ru;
        paragraph.textContent = text.eng;

        image.classList.add(`${className}__background`);

        const active_panel = document.createElement("div");
        active_panel.classList.add(`${className}__active-panel`);

        const rotate_button = document.createElement("img");
        rotate_button.setAttribute("src", `${path}/img/rotate.svg`);
        rotate_button.classList.add(`${className}__rotate-button`);
        rotate_button.addEventListener('click', () => {
            div.classList.toggle(className + '__flipped');
        });
        const voiceButton = document.createElement('img');
        voiceButton.setAttribute("src", `${path}/img/audio.svg`)
        voiceButton.classList.add(`${className}__voice-button`);
        voiceButton.addEventListener('click', () => {
            new Audio(`${path}/${audioSrc}`).play();
        });

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add(`${className}__buttons-container`)

        buttonsContainer.appendChild(voiceButton);
        buttonsContainer.appendChild(rotate_button);

        div.addEventListener('mouseleave', () => {
            div.classList.remove(className + '__flipped');
        });

        active_panel.appendChild(paragraph);
        active_panel.appendChild(buttonsContainer);

        card_front.appendChild(image);
        card_front.appendChild(active_panel);

        card_back.appendChild(paragraph_rus);

        div.appendChild(card_front);
        div.appendChild(card_back);
        div.setAttribute('id', className + '__' + text.eng)
    }
    document.querySelector("main").appendChild(div);

    return div;
}

function generateStarsContainer() {
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars-container');
    const starsCorrect = document.createElement('div');
    starsCorrect.classList.add('correct-stars');
    const starsIncorrect = document.createElement('div');
    starsIncorrect.classList.add('incorrect-stars');
    starsContainer.appendChild(starsIncorrect);
    starsContainer.appendChild(starsCorrect);
    GameLogic.getMain().appendChild(starsContainer);
}

function generateSection(section_objects, name) {
    clearMain();
    generateStarsContainer();
    section_objects.forEach((element) => {
        createCard(element.image, { eng: element.word, ru: element.translation }, false, element.audioSrc);
    });
    GameLogic.getMain().section = true;
    GameLogic.getMain().sectionName = name;

    if (GameLogic.IsGameStarted())
        GameLogic.startGameLogic();
}

function generateSectionsList() {
    GameLogic.interruptGame();
    clearMain();
    document.querySelector('.main__win').style["display"] = "none"
    cards[0].forEach((element, index) => {
        const section_name = element;
        const section_objects = cards[index + 1];
        const image = section_objects[0].image;

        const card = createCard(image, section_name, true);

        card.addEventListener("click", function (event) {
            generateSection(section_objects, section_name);
        });
    });
    GameLogic.getMain().section = false;
    GameLogic.getMain().sectionName = null;
}

function generateStatList() {
    GameLogic.interruptGame();
    clearMain();

    const statistic = Stat.storage;
    console.log('statistic:', statistic)
    const statLayout = document.createElement('div');
    statLayout.classList.add('statistic');
    const sectionNames = document.createElement('div');
    sectionNames.classList.add('statistic__section-names');
    const sectionResults = document.createElement('div');
    sectionResults.classList.add('statistic__section-results')
    cards[0].forEach((element, index) => {
        const sectionName = document.createElement('p');
        sectionName.textContent = element;
        sectionNames.appendChild(sectionName);

        const sectionResult = document.createElement('p');
        const values = statistic[index + 1] || {};
        const wins = values.wins || 0;
        const looses = values.looses || 0;
        const total_games = wins + looses
        let winrate = (wins / (total_games || 1) * 100).toFixed(1);
        sectionResult.textContent = `${wins} wins, ${looses} looses, winrate: ${winrate > 0 ? winrate + '%' : '-'}`;
        sectionResults.appendChild(sectionResult);
    })
    statLayout.appendChild(sectionNames);
    statLayout.appendChild(sectionResults);
    GameLogic.getMain().appendChild(statLayout);
}

function getBurgerMenuState() {
    return document.querySelector("#burger__toggle").checked
}

function hideBurgerMenu() {
    if (getBurgerMenuState()) document.querySelector("#burger__toggle").checked = false;
}

document.querySelector(".burger").addEventListener('mouseleave', function () {
    hideBurgerMenu();
});

function createBurgerMenuSectionButton(text, func, args = []) {
    const button = document.createElement("p");
    button.textContent = text;
    button.addEventListener("click", function (event) {
        func(...args);
        hideBurgerMenu();
    });
    return button;
}

function generateBurgerMenu() {
    const burgerMenuWindow = document.querySelector(".burger__menu");
    const burgerMenuSections = cards[0].map((element, index) => createBurgerMenuSectionButton(element, generateSection, [cards[index + 1], element]));
    const buttonMainPage = createBurgerMenuSectionButton("Main Page", generateSectionsList);
    const buttonStatistic = createBurgerMenuSectionButton("Statistics", generateStatList);
    burgerMenuSections.unshift(buttonMainPage);
    burgerMenuSections.push(buttonStatistic);
    burgerMenuSections.forEach((element) => burgerMenuWindow.appendChild(element));
}

function clearMain() {
    GameLogic.getMain().innerHTML = "<main></main>";
}

export { generateSectionsList, generateBurgerMenu, generateSection, clearMain, generateStarsContainer };