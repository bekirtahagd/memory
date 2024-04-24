//References
let cards = document.querySelectorAll(".memory-card");
 
//Data
let amountSelectable = 2;
let selectedCards = [];
let icons = ["😀", "😍", "😙", "😝", "😡", "🦇"];
 
//Constants
const fadeDelay = 1000;
 
// Event Listeners
addEventListener("click", (event) => changeCardState(event));
 
 
 
//Beginning
createIconList();
shuffleCards();
 
 
 
function createIconList() {
    let temp = [];
    for (let i = 0; i < icons.length; i++) {
        for (let j = 0; j < amountSelectable; j++) {
            temp.push(icons[i]);
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
 
    for (let i = 0; i < icons.length; i++) {
        cards[i].querySelector(".card__item").textContent = icons[i];
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
    for (let i = 0; i < selectedCards.length; i++) {
        selectedCards[i].dataset.state = "collected";
    }
    clearSelected(false);
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
 
// Utility Functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}