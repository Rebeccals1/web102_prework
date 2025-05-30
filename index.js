/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let game of games) {

        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")

        const pledgeDiff = (game.goal - game.pledged) < 0 ? 
            `Over by $${Math.abs(game.goal - game.pledged).toLocaleString()}` : 
            `Needed $${(game.goal - game.pledged).toLocaleString()}`;

        gameCard.innerHTML = `
            <img src="${game.img}" class="game-img" alt="${game.name}" />
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <p>Pledged: $${game.pledged.toLocaleString()}</p>
            <p>Goal: $${game.goal.toLocaleString()}</p>
            <p>${pledgeDiff}</p>
            <p>Backers: ${game.backers.toLocaleString()}</p>
        `;

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
        
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (total, game) => total + game.backers, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = totalContributions.toLocaleString();

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// Total Amount raised
const totalRaised = GAMES_JSON.reduce( (total, game) => total + game.pledged, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.length;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter( game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedgames = GAMES_JSON.filter( game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedgames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// add event listeners with the correct functions to each button
document.getElementById("unfunded-btn").addEventListener("click", filterUnfundedOnly);
document.getElementById("funded-btn").addEventListener("click", filterFundedOnly);
document.getElementById("all-btn").addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numUnfundedGames = GAMES_JSON.filter( game => game.pledged < game.goal).length;

// create a string that explains the number of unfunded games using the ternary operator
const unfunded = numUnfundedGames === 0 ? 0 : numUnfundedGames;
const funded = GAMES_JSON.length - numUnfundedGames;
const totalGames = GAMES_JSON.length;

// create a new DOM element containing the template string and append it to the description container
const displayStr = `We have a total of \$${totalRaised.toLocaleString()} raised from our ${totalGames} games on our site. Currently, ${funded} are fully funded and ${unfunded} remain unfunded. We need your help to fund these amazing games!`;

const description = document.createElement("p");
description.innerHTML = displayStr;
descriptionContainer.appendChild(description);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [topGame, runnerUp] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameElement = document.createElement("h2");
topGameElement.innerHTML = topGame.name;
firstGameContainer.appendChild(topGameElement);

// do the same for the runner up item
const runnerUpElement = document.createElement("h2");
runnerUpElement.innerHTML = runnerUp.name;
secondGameContainer.appendChild(runnerUpElement);


/************************************************************************************
 * Extra Bonus Work: Add a search bar to filter games by name
 * Skills used: filter, event listeners, DOM manipulation
 */

document.getElementById("search-bar").addEventListener("input", function(event) {
    const query = event.target.value.toLowerCase();

    // Filter games from GAMES_JSON that match the query
    const filteredGames = GAMES_JSON.filter(game =>
        game.name.toLowerCase().includes(query)
    );

    // Clear the game cards
    deleteChildElements(gamesContainer);

    // Re-render only the matching games
    addGamesToPage(filteredGames);
});



/************************************************************************************
 * Extra Bonus Work: Add button that sorts by the most backers
 * Skills used: functions, filter, sort
 */

// sort games by the amount of backers it has
function filterByBackers() {
    deleteChildElements(gamesContainer); // remove existing cards

    const sortedByBackers = [...GAMES_JSON].sort((a, b) => b.backers - a.backers);
    
    addGamesToPage(sortedByBackers); // re-render sorted list
}

// add event listeners with the correct functions to each button
document.getElementById("backers-btn").addEventListener("click", filterByBackers);