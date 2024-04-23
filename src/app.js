//References
let cards = document.querySelectorAll(".memory-card");

//Data
let selectedCards = [];
let icons = ["😀","😀", "😍","😍", "😙", "😙", "😝", "😝", "😡", "😡"];

// Event Listeners
addEventListener("click", (event) => changeCardState(event));

console.log(cards[0].querySelector(".card__item").textContent);





//Set Cards Randomly
for (let i = 0; i < cards.length; i++) {
    let usedIndex = [];

    while(usedIndex.length < cards.length){
        let rand = getRandomInt(icons.length);
        // if (!usedIndex.includes(rand)) {        
        //     cards[i].querySelector(".card__item").textContent = icons[rand];
        //     usedIndex.push(rand);
        // }
        cards[i].querySelector(".card__item").textContent = icons[rand];
        usedIndex.push(rand);
    }
}


function changeCardState(e) {
  if (selectedCards.length < 2) {
    if (e.target.dataset.state === "hidden") {
        selectedCards.push(e.target);
        e.target.dataset.state = "open";

        //If player selected two cards, hide both
        if (selectedCards.length == 2) {
            setTimeout(clearSelected, 1000);
        }
    }
  }
}

function clearSelected() {
    console.log(selectedCards);

    //Hide Cards and Clear Array
    for (let i = selectedCards.length - 1; i >= 0; i--) {
        selectedCards[i].dataset.state = "hidden";
        selectedCards.pop();
    }
}

// Utility Functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}