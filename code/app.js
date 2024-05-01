//Visual References
let inputAmountPairs = document.querySelector("#amountOfPairs");
let inputAmountPlayers = document.querySelector("#amountOfPlayers");
let inputAmountSelectable = document.querySelector("#pairSize");
let cardsWrapper = document.querySelector(".cards__wrapper");
let scoresWrapper = document.querySelector(".scores");
let turnVisual = document.querySelector("#turn");
let buttonShuffle = document.querySelector("#start");


//HTML References
let cards = [];
let selectedCards = [];
let scores = [];
 
//Templates
let iconTemplate = ["😀", "😍", "😙", "😝", "😡", "🦇", "⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🙀","👽", "👾", "🤖", "🎃"]; //This needs to be dynamically imported from an api so we dont have to use amount dividable by 6
let cardTemplate = cardsWrapper.innerHTML;
 
//Settings
let amountOfPairs;
let amountSelectable;
let amountofPlayers;
let icons;
 
//Game Stats
let currentPlayerIndex = 0;
let sumScore = 0;
let isGameFinished = false;
 
//Constants
const fadeDelay = 1000;
 

// Event Listeners
buttonShuffle.addEventListener("click", () => {
  //If amount of cards changed, we need to print new Cards
  if (inputAmountPairs.value != amountOfPairs || inputAmountSelectable.value != amountSelectable || isGameFinished) generateCards();
  else hideCards();

  if(inputAmountPlayers.value != amountofPlayers) generatePlayers();
  else resetTurn();


  isGameFinished = false;
  generateScores();
  shuffleCards();
});

//Check that amount of pairs cant get higher than icon Template Lengt
inputAmountPairs.addEventListener("change", (e) => {
    if (inputAmountPairs.value > iconTemplate.length) {
        inputAmountPairs.value = iconTemplate.length;
    } 
})
 
// Cards
function generateCards() {
  amountOfPairs = inputAmountPairs.value;
  amountSelectable = inputAmountSelectable.value;
 
  //Delete (selected) cards
  cards = [];
  clearSelected();
 
  //Create Icon List in dependence of amount
  createIconList();
 
  //Set first card  
  let parent = cardsWrapper;
  parent.innerHTML = cardTemplate;
 
  //Get Template Variable
  let template = cardsWrapper.querySelector(".card");
  template.addEventListener("click", (event) => selectCard(event));
  template.dataset.state = "hidden";
  cards.push(template);
 
  //Loop through cards and generate each one
  for (let i = 0; i < (amountOfPairs * amountSelectable) - 1; i++) {
    let newElement = document.createElement("div");
    newElement.classList.add("card");
    newElement.dataset.state = "hidden";
    newElement.innerHTML = template.innerHTML;
 
    parent.appendChild(newElement);
 
    newElement.addEventListener("click", (event) => selectCard(event));
    cards.push(newElement);
  }
}
 
function hideCards() {
  //loop through every card and hide it
  cards.forEach(card => {
    card.dataset.state = "hidden";
  });
}
 
function shuffleCards() {
  //Shuffle Algorithm
  for (let i = icons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = icons[i];
    icons[i] = icons[j];
    icons[j] = temp;
  }
 
  //Set Icons
  for (let i = 0; i < cards.length; i++) {
    cards[i].querySelector(".card__item").innerText = icons[i];
  }
}
 
function selectCard(e) {
  //If can select card
  if (selectedCards.length < amountSelectable) {
    //If is a hidden/clickable card
    if (e.target.dataset.state === "hidden") {
      //Add to selected cards
      selectedCards.push(e.target);
      e.target.dataset.state = "open";
 
      //If player selected two cards, hide both
 
      //TODO
      if (selectedCards.length == amountSelectable) {
        
        setTimeout(() => {
          if (!checkForMatch()){
            clearSelected(true);
            nextPlayer();
          } else {
            collectSelected();
          }
        }, fadeDelay)
      }
    }
  }
}
 
//Players
function generatePlayers() {
  //Players are only saved in the amount of players variable
  amountofPlayers = inputAmountPlayers.value;
}
function nextPlayer() {
  if (currentPlayerIndex + 1 < amountofPlayers) {
    currentPlayerIndex++;
  } else {
    currentPlayerIndex = 0;
  }
 
  //Change Turn Visually
  turnVisual.innerText = currentPlayerIndex + 1;
}
 
 
//Scores
function generateScores() {
  //reset scores
  scores = [];
  sumScore = 0;
  scoresWrapper.innerHTML = "";
 
  //Create new Score dependent on amount of Players
  for (let i = 0; i < amountofPlayers; i++) {
    //Variable
    scores.push(0);
 
    //Visual
    scoresWrapper.innerHTML +=
      (i + 1) + '. Player: <span id="score' + i + '">0</span><br>';
  }
}
 
function addPlayerScore(added) {
  scores[currentPlayerIndex] += added;
  sumScore += added;
 
  //Visually Update
  scoresWrapper.querySelector("#score" + currentPlayerIndex).innerText =
    scores[currentPlayerIndex];
}
 
function setPlayerScore(newScore) {
  let cScore = scores[currentPlayerIndex]; //current score
  let scoreDifference = newScore - cScore; //difference between new and old score
 
  //Update score (sum)
  sumScore += scoreDifference;
  scores[currentPlayerIndex] = newScore;
}
 
 
//Turn
function resetTurn() {
  currentPlayerIndex = 0;
  turnVisual.textContent = 1;
}
 
//Icon List
function createIconList() {
  //temporary icon list equals template
  let temp = shortenArray(iconTemplate, amountOfPairs);
 
 
  //if amount of cards smaller than iconTemplate, shorten icon template
  if (amountOfPairs > iconTemplate.length) console.error("Two many pairs");
 
 
  //Create Icon List
  icons = [];
  temp.forEach(icon => {
    for (let i = 0; i < amountSelectable; i++) {
      icons.push(icon);
    }
  });
}
 
 
//Selected
function collectSelected() {
  //add score
  addPlayerScore(1);
 
  //collect
  for (let i = 0; i < selectedCards.length; i++) {
    selectedCards[i].dataset.state = "collected";
  }
 
  //clear selected variable
  clearSelected();
 
  //if all cards are collected, player has won;
  if (hasPlayerWon()) {
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
 
 
 
//Data Processing
function checkForMatch() {
  let won = true;
 
  //loop through selected cards and check whether 2 cards always match with each other
  for (let i = 0; i < selectedCards.length - 1; i++) {
    if (selectedCards[i].textContent !== selectedCards[i + 1].textContent) {
      won = false;
      break;
    }
  }
 
  //If all cards matched -> won = true
 
  return won;
}
 
function playerWon() {
  //Get winner  
  let winner = getIndexOfHighestValue(scores); //Get Winner
 
  isGameFinished = true;
 
  //Check whether there was a tie
  let message = "";
  if (winner == -1){
    message = "Oh. It looks like a tie!";
  } else {
      message = "Player " + (winner + 1) + " has won with a Score of " + scores[winner] + "! Congratulation!";
  }
 
  confirm(message);
}
 
function hasPlayerWon() {
  return sumScore == amountOfPairs;
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
 