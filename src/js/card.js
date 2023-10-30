import GameLogic from "./game";

const PATH = "./";
const className = "word-card";

function createImage(img) {
    const image = document.createElement("img");
    image.setAttribute("src", `${PATH}/${img}`);
    image.setAttribute("alt", img);
    return image;
}

function createParagraph(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    return paragraph;
}

function addZoom(tag) {
    tag.addEventListener('mouseover', () => {
        tag.classList.toggle('card__zoom');
    });
    tag.addEventListener('mouseleave', () => {
        tag.classList.remove('card__zoom');
    });
}

function createCardContainer() {
    const container = document.createElement("div");
    addZoom(container);
    container.classList.add("card");

    return container;
}

function createVoiceButton(audioSrc) {
    const voiceButton = document.createElement('img');
    voiceButton.setAttribute("src", `${PATH}/img/audio.svg`)
    voiceButton.classList.add(`${className}__voice-button`);
    voiceButton.addEventListener('click', () => {
        new Audio(`${PATH}/${audioSrc}`).play();
    });

    return voiceButton;
}

function createRotateButton(container) {
    const rotate_button = document.createElement("img");
    rotate_button.setAttribute("src", `${PATH}/img/rotate.svg`);
    rotate_button.classList.add(`${className}__rotate-button`);
    rotate_button.addEventListener('click', () => {
        container.classList.toggle(className + '__flipped');
    });

    return rotate_button;
}

function createButtons(container, audioSrc) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add(`${className}__buttons-container`);
    const rotate_button = createRotateButton(container);
    const voiceButton = createVoiceButton(audioSrc);
    buttonsContainer.appendChild(voiceButton);
    buttonsContainer.appendChild(rotate_button);

    return buttonsContainer;
}

function createActivePanel(container, paragraph, audioSrc) {
    const buttonsContainer = createButtons(container, audioSrc);
    const active_panel = document.createElement("div");
    active_panel.classList.add(`${className}__active-panel`);
    active_panel.appendChild(paragraph);
    active_panel.appendChild(buttonsContainer);

    return active_panel;
}

function createFront(audioSrc, container, paragraph, image) {
    const card_front = document.createElement("div");
    card_front.classList.add(className + "__front");

    const active_panel = createActivePanel(container, paragraph, audioSrc);

    card_front.appendChild(image);
    card_front.appendChild(active_panel);

    return card_front;
}

function createBack(text) {
    const card_back = createCardContainer();
    card_back.classList.add(className + "__back");

    const paragraph_rus = document.createElement("p");
    paragraph_rus.textContent = text.ru;

    card_back.appendChild(paragraph_rus);

    return card_back;
}

function generalCardTemplate(img, text, classes = {}) {
    const container = createCardContainer();
    container.classList.add(classes.container || 'empty');
    const image = createImage(img);
    image.classList.add(classes.image || 'empty');
    const paragraph = createParagraph(text);
    paragraph.classList.add(classes.paragraph || 'empty');

    return [
            container, 
            image, 
            paragraph,
        ];
}

function createWordCard(img, text, audioSrc) {
    const [container, image, paragraph] = generalCardTemplate(img, text.eng, 
        {
            container: className,
            image: `${className}__background`,
        },
    );
    container.addEventListener('mouseleave', () => {
        container.classList.remove(className + '__flipped');
    });
    container.setAttribute('id', className + '__' + text.eng);

    const card_front = createFront(audioSrc, container, paragraph, image);
    const card_back = createBack(text);

    container.appendChild(card_front);
    container.appendChild(card_back);
    GameLogic.getMain().appendChild(container);
}

function createSectionCard(img, text) {
    const [container, image, paragraph] = generalCardTemplate(img, text, {
            container: 'section-card'
        }
    );

    container.appendChild(image);
    container.appendChild(paragraph);
    GameLogic.getMain().appendChild(container);

    return container;
}   

export function createCard(img, text, isSection, audioSrc) {
    return isSection ? createSectionCard(img, text) : createWordCard(img, text, audioSrc);
}