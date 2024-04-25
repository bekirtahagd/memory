//References
let cards = [];
let shuffleButton = document.querySelector("#input-number");
let buttonShuffle = document.querySelector("#box__button");
let cardsWrapper = document.querySelector("#memory-card__wrapper");
let scoreVisual = document.querySelector("#score");
 
//Data
let amountOfCards;
let amountSelectable;
let selectedCards = [];
let iconTemplate = ["😀", "😍", "😙", "😝", "😡", "🦇"] //This needs to be dynamically imported from an api so we dont have to use amount dividable by 6
let icons;

//Game Stats
let score = 0;
 
//Constants
const fadeDelay = 1000;
 
//Visual Data
let cardTemplate = cardsWrapper.innerHTML;

// Event Listeners
buttonShuffle.addEventListener("click", ()=> {
    if (shuffleButton.value != amountOfCards) generateCards();
    shuffleCards();
});

//In the beginning
updateScore(0);

 
//Generate Cards
function generateCards(){
    amountOfCards = shuffleButton.value; //Input needs to be dividable by 6
    
    cards = [];
    score = 0;

    createIconList();

    let parent = cardsWrapper;
    parent.innerHTML = cardTemplate;

    let template = cardsWrapper.querySelector(".memory-card");
    template.addEventListener("click", (event) => changeCardState(event));
    template.dataset.state = "hidden";
    cards.push(template);


    for(let i = 0; i < amountOfCards - 1; i++) {
        let newElement = document.createElement("div");
        newElement.classList.add("memory-card");
        newElement.dataset.state = "hidden";
        newElement.innerHTML = template.innerHTML;

        parent.appendChild(newElement);

        newElement.addEventListener("click", (event) => changeCardState(event));
        cards.push(newElement);
    }
}
 
 
function createIconList() {
    amountSelectable = amountOfCards / 6;
    let temp = [];
    for (let i = 0; i < iconTemplate.length; i++) {
        for (let j = 0; j < amountSelectable; j++) {
            temp.push(iconTemplate[i]);
        }
    }
    icons = temp;
}
 
function shuffleCards() {
    for (let i = icons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = icons[i];
        icons[i] = icons[j];
        icons[j] = temp;
    }
    
    console.log(cards);
    for(let i = 0; i < cards.length; i++){
        cards[i].querySelector('.card__item').innerText = icons[i];
    }
 
    console.log(icons);
}
 
function changeCardState(e) {
    if (selectedCards.length < amountSelectable) {
        if (e.target.dataset.state === "hidden") {
            selectedCards.push(e.target);
            e.target.dataset.state = "open";
 
            //If player selected two cards, hide both
            if (selectedCards.length == amountSelectable) {
                if (!checkForMatch()) {
                    setTimeout(() => clearSelected(true), fadeDelay);
                }
                else {
                    setTimeout(collectSelected, fadeDelay);
                }
            }
        }
    }
}
 
function collectSelected() {
    updateScore(1);
    for (let i = 0; i < selectedCards.length; i++) {
        selectedCards[i].dataset.state = "collected";
    }
    clearSelected(false);
    console.log(score);
}
 
function clearSelected(visualHide) {
    //Hide Cards and Clear Array
    for (let i = selectedCards.length - 1; i >= 0; i--) {
        if (visualHide) { selectedCards[i].dataset.state = "hidden"; }
        selectedCards.pop();
    }
}
 
function checkForMatch() {
    let won = true;
 
    for (let i = 0; i < selectedCards.length - 1; i++) {
        if (selectedCards[i].textContent !== selectedCards[i + 1].textContent) {
            won = false;
            break;
        }
    }
 
    return won;
}
 
function updateScore(added){
    score += added;
    scoreVisual.innerText = score;
}
 
// Utility Functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}