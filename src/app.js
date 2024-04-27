/*  ***TODO***
    -Code Organisation
    -Commentating Code
*/
 
 
//References
let cards = [];
let inputAmountCards = document.querySelector("#input-cards");
let inputAmountPlayers = document.querySelector("#input-player");
let buttonShuffle = document.querySelector("#shuffle__button");
let cardsWrapper = document.querySelector("#memory-card__wrapper");
let scoresVisual = document.querySelector("#scores");
let playerVisual = document.querySelector("#player");
let roundVisual = document.querySelector("#round");
 
//Data
let amountOfCards;
let amountSelectable;
let selectedCards = [];
let iconTemplate = ["😀", "😍", "😙", "😝", "😡", "🦇", "⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🙀","👽", "👾", "🤖", "🎃"]; //This needs to be dynamically imported from an api so we dont have to use amount dividable by 6
let icons;
 
//Game Stats
let amountofPlayers;
let scores = [];
let sumScore = 0;
let currentPlayerIndex = 0;
let isGameFinished = false;
let round = 1;
 
//Constants
const fadeDelay = 1000;
 
//Visual Data
let cardTemplate = cardsWrapper.innerHTML;
 
// Event Listeners
buttonShuffle.addEventListener("click", () => {
  if (inputAmountCards.value != amountOfCards || isGameFinished) generateCards();
  else hideCards();
  if(inputAmountPlayers.value != amountofPlayers) generatePlayers();
  else resetPlayers();
 
  isGameFinished = false;
  generateRound();
  generatePlayers();
  shuffleCards();
});
 
//Generate Cards
function hideCards() {
  cards.forEach(card => {
    card.dataset.state = "hidden";
  });
}


function generateRound() {
  round = 1;
  roundVisual.innerText = round;
}
function updateRound(amount){
  round += amount;
  roundVisual.innerText = round;
}

function generateScores() {
  scores = [];
  sumScore = 0;
  scoresVisual.innerHTML = "";
  for (let i = 0; i < amountofPlayers; i++) {
    //Variable
    scores.push(0);
 
    //Visual
    scoresVisual.innerHTML +=
      "Player" + (i + 1) + ': <span id="score' + i + '">0</span><br>';
  }
}
function generatePlayers() {
  amountofPlayers = inputAmountPlayers.value;
  generateScores();
}
function resetPlayers() {
  currentPlayerIndex = 0;
  playerVisual.textContent = 1;
}
function nextPlayer() {
  if (currentPlayerIndex + 1 < amountofPlayers) {
    currentPlayerIndex++;
  } else {
    currentPlayerIndex = 0;
    updateRound(1);
  }
 
  playerVisual.innerText = currentPlayerIndex + 1;
}
 
function generateCards() {
  amountOfCards = inputAmountCards.value; //Input needs to be dividable by 6
 
  cards = [];
  clearSelected();
 
  createIconList();
 
  let parent = cardsWrapper;
  parent.innerHTML = cardTemplate;
 
  let template = cardsWrapper.querySelector(".memory-card");
  template.addEventListener("click", (event) => selectCard(event));
  template.dataset.state = "hidden";
  cards.push(template);
 
  for (let i = 0; i < amountOfCards - 1; i++) {
    let newElement = document.createElement("div");
    newElement.classList.add("memory-card");
    newElement.dataset.state = "hidden";
    newElement.innerHTML = template.innerHTML;
 
    parent.appendChild(newElement);
 
    newElement.addEventListener("click", (event) => selectCard(event));
    cards.push(newElement);
  }
}
 
function createIconList() {
  let temp = iconTemplate;
 
  if (amountOfCards / 2 < iconTemplate.length) temp = shortenArray(temp, (amountOfCards/2));
 
 
  amountSelectable = amountOfCards / temp.length;
 
  icons = [];
  temp.forEach(icon => {
    for (let i = 0; i < amountSelectable; i++) {
      icons.push(icon);
    }
  });
}
 
function shuffleCards() {
  for (let i = icons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = icons[i];
    icons[i] = icons[j];
    icons[j] = temp;
  }
 
  for (let i = 0; i < cards.length; i++) {
    cards[i].querySelector(".card__item").innerText = icons[i];
  }
 
}
 
function selectCard(e) {
  if (selectedCards.length < amountSelectable) {
    if (e.target.dataset.state === "hidden") {
      selectedCards.push(e.target);
      e.target.dataset.state = "open";
 
      //If player selected two cards
      if (selectedCards.length == amountSelectable) {
        setTimeout(() => {
          if (!checkForMatch()){
            clearSelected(true);
            nextPlayer();
          } else {
            collectSelected();
          }
          console.log(round);
        }, fadeDelay)
      }
    }
  }
}
 
function collectSelected() {
  updatePlayerScore(1);
 
  for (let i = 0; i < selectedCards.length; i++) {
    selectedCards[i].dataset.state = "collected";
  }
 
  clearSelected(false);
 
  if (sumScore == amountOfCards / amountSelectable) {
    playerWon();
  }
}
 
function clearSelected(visualHide) {
  //Hide Cards and Clear Array
  for (let i = selectedCards.length - 1; i >= 0; i--) {
    if (visualHide) {
      selectedCards[i].dataset.state = "hidden";
    }
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
 
function updatePlayerScore(added) {
  scores[currentPlayerIndex] += added;
  sumScore += added;
 
  //Visually Update
  scoresVisual.querySelector("#score" + currentPlayerIndex).innerText =
    scores[currentPlayerIndex];
}
 
function playerWon() {
  let message = "";
  let winner = getIndexOfHighestValue(scores);
 
  isGameFinished = true;
 
  //Check whether there was a tie
  if (winner == -1){
    message = "Oh. It looks like a tie!";
  } else {
      message = "Player " + (winner + 1) + " has won with a Score of " + scores[winner] + "! Congratulation!";
  }
 
  confirm(message);
}
 
// Utility Functions
 
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
 
//Tie returns -1
function getIndexOfHighestValue(array){
    let hValue = array[0];
    let hIndex = 0;
 
    let tie = false;
 
    for (let i = 1; i < array.length; i++){
        let cValue = array[i];
        if (cValue > hValue){
            if (tie) tie = false;
 
            hValue = cValue;
            hIndex = i;
        } else if (cValue == hValue){
            tie = true;
        }
    }
 
    if (tie) return -1;
    else return hIndex;
}
function getHighestValueInArray(array){
    let hValue = array[0];
 
    for (let i = 1; i < array.length; i++){
        if (array[i] > hValue){
            hValue = cValue;
        }
    }
    return hValue;
}
 
function shortenArray(array, length){
  return array.slice(0, length);
}
 