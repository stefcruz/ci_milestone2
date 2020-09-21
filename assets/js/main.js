
// -----------------------------------------------  Selectors
const searchButton = document.querySelector("#search");
const recipeCards = document.querySelector("#recipe-cards__main");
const errorHandling = document.querySelector("#error-handling");
const clearIcon = document.querySelector("#recipe-form__clear-icon");
const searchBar = document.querySelector("#recipe-form__search-bar");
const recipeCardsImmunity = document.querySelectorAll("#recipe-cards__immunity");
const recipeCardsBalanced = document.querySelectorAll("#recipe-cards__balanced");
const recipeCardsVeggie = document.querySelectorAll("#recipe-cards__veggie");

// ----------------------------------------------- Event Listeners
searchButton.addEventListener("click", () => {
    console.log('Button pressed')
    recipeAPI();
});

//Event listeners taken from https://www.mikedane.com/web-development/css/styling-search-bar/
searchBar.addEventListener("keyup", () => {
    if (searchBar.value && clearIcon.style.visibility != "visible") {
        clearIcon.style.visibility = "visible";
    } else if (!searchBar.value) {
        clearIcon.style.visibility = "hidden";
    }
});

clearIcon.addEventListener("click", () => {
    searchBar.value = "";
    clearIcon.style.visibility = "hidden";
});

// ----------------------------------------------- Main Section - Search bar
let appId = 'ba5b7a21',
    apiKey = 'd1d3afcdc37dd030c29294267aaedbc8';

// Function to get value from ticked checkbox. 
function checkboxDietLabel() {
    let checkboxDiet = document.forms[0];
    let i;
    let checkboxDietValueArray = [];

    //For loop adapted from https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_checkbox_order
    for (i = 0; i < checkboxDiet.length; i++) {
        if (checkboxDiet[i].checked) {
            checkboxDietValueArray.push(checkboxDiet[i].value);
        }
    }
    console.log(checkboxDietValueArray);

    // Checking if there's any checkbox ticked. If yes, append values to the API URL.
    if (checkboxDietValueArray.length === 0) {
        return "";
    }
    else if (checkboxDietValueArray.length === 1) {
        return `&diet=${checkboxDietValueArray[0]}`;
    } else {
        let checkboxDietValue = ""
        for (let j = 0; j < checkboxDietValueArray.length; j++) {
            checkboxDietValue += `&diet=${checkboxDietValueArray[j]}`
        }
        return checkboxDietValue;
    }
}

// Get data from Recipe API: Search bar
async function recipeAPI() {
    let searchValue = document.querySelector("#recipe-form__search-bar").value;
    let dietLabels = checkboxDietLabel();
    let response = await fetch(`https://api.edamam.com/search?app_id=${appId}&app_key=${apiKey}&q=${searchValue}${dietLabels}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            recipeAPIDataSearchBar(data);
        })
        .catch(err => {
            errorHandling.innerHTML = "<p>Oops something went wrong, try again.</p>"
            console.log(err);
        });
}

// Recipe API data: Search bar
function recipeAPIDataSearchBar(data) {
    for (let i = 0; i < 8; i++) {
        if (typeof(data.hits[i]) != undefined) {
            if (data.hits[0].recipe.healthLabels > 1) {
                let healthLabels;
                for (let j = 0; j < 8; j++) {
                    healthLabels += `<span class="badge badge-pill badge-success">${data.hits[i].recipe.healthLabels}</span>                    `
                }
            }
            recipeCards.innerHTML += `
            <div class="col-12 col-md-6 col-xl-3 col-lg-3">
                <div class="card card__main">
                <img src="${data.hits[i].recipe.image}"
                    class="card-img-top" alt="Recipe image">
                <div class="card-body">
                    <h5 class="card-title" id="card-title">${data.hits[i].recipe.label}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Calories: ${parseInt(data.hits[i].recipe.calories)}</li>
                    <li class="list-group-item">Ingredients used: ${data.hits[i].recipe.ingredients.length}</li>
                    <li class="list-group-item">Health labels: ${healthLabels}</li>
                </ul>
                <a href="${data.hits[i].recipe.url}" target="_blank" class="btn btn-primary">See Recipe</a>
                </div>
            </div>
                `
        } else {
            `"<p>We couldn't find any results with this search. Please change the search term.</p>"`
        }
        
    };
}

// ----------------------------------------------- Inspiration Section
//Get data from Recipe API: Imunno Supportive filter
async function recipeAPIImmunity() {
    let response = await fetch(`https://api.edamam.com/search?app_id=${appId}&app_key=${apiKey}&q=&health=immuno-supportive`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            recipeAPIDataImmunity(data);
        })
        .catch(err => {
            errorHandling.innerHTML = "<p>Oops something went wrong, please reload the page.</p>"
            console.log(err);
        });
}

// Recipe API data: Imunno Supportive filter
function recipeAPIDataImmunity(data) {
    for (let i = 0; i < 10; i++) {
        recipeCardsImmunity[i].innerHTML += `
        <div class="col-12 col-md-6 col-xl-3 col-lg-3 inspiration-container__card">
            <img src="${data.hits[i].recipe.image}" class="card-img-top" alt="Recipe image">
            <h5>${data.hits[i].recipe.label}</h5>
            <a href="${data.hits[i].recipe.url}" target="_blank">SEE RECIPE</a>
        </div>
        `
    };
}


// Get data from Recipe API: Balanced filter
async function recipeAPIBalanced() {
    let response = await fetch(`https://api.edamam.com/search?app_id=${appId}&app_key=${apiKey}&q=&diet=balanced`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            recipeAPIDataBalanced(data);
        })
        .catch(err => {
            errorHandling.innerHTML = "<p>Oops something went wrong, please reload the page.</p>"
            console.log(err);
        });
}

// Recipe API data: Well Balanced filter
function recipeAPIDataBalanced(data) {
    for (let i = 0; i < 10; i++) {
        recipeCardsBalanced[i].innerHTML += `
        <div class="col-12 col-md-6 col-xl-3 col-lg-3 inspiration-container__card">
            <img src="${data.hits[i].recipe.image}" class="card-img-top" alt="Recipe image">
            <h5>${data.hits[i].recipe.label}</h5>
            <a href="${data.hits[i].recipe.url}" target="_blank">SEE RECIPE</a>
        </div>
        `
    };
}

// Get data from Recipe API: Veggie filter
async function recipeAPIVeggie() {
    let response = await fetch(`https://api.edamam.com/search?app_id=${appId}&app_key=${apiKey}&q=&health=vegetarian`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            recipeAPIDataVeggie(data);
        })
        .catch(err => {
            errorHandling.innerHTML = "<p>Oops something went wrong, please reload the page.</p>"
            console.log(err);
        });
}


// Recipe API data: Veggie filter
function recipeAPIDataVeggie(data) {
    for (let i = 0; i < 10; i++) {
        recipeCardsVeggie[i].innerHTML += `
        <div class="col-12 col-md-6 col-xl-3 col-lg-3 inspiration-container__card">
            <img src="${data.hits[i].recipe.image}" class="card-img-top" alt="Recipe image">
            <h5>${data.hits[i].recipe.label}</h5>
            <a href="${data.hits[i].recipe.url}" target="_blank">SEE RECIPE</a>
        </div>
        `
    };
}