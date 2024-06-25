// first of all we add addEventListener so that all the html content have loaded in which we have 
// search button, searchbar and thirdly we have buttons which we get by quaryselectorAll method
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const buttons = document.querySelectorAll('.btn');

    // we add addEventListener on search button so that when user clicked on search button 
    // an errow function will call and declare a varible whose data type is const 
    // the code inside the curly braces is executed when the search button is clicked
    // Add event listener to the search button
    searchButton.addEventListener('click', () => {

        // the value which has to be typed in search bar will get here by the method of dot suppose we type "curry" in search bar the syntax will be
        // const query = searchBar.curry and this value is stored in query variable.
        const query = searchBar.value;

        // this function is used for fetching a recipes on the demand of user like Curry 
        fetchRecipes(query);
    });

    // Add event listeners to navbar buttons
    // buttons is already get above and now we iterate on buttons by using for each loop.. 
    // for each loop is used to iterate on every element mostly it is used for buttons iterations
    buttons.forEach(button => {

        // after using foreach loop an arrow function will call in which 
        // we add addEventListener on button when user clicked on a particular button the rest of function will call

        button.addEventListener('click', function () {

            // this method is used to get the particular attribute of the certain element like here 
            // we are trying to get the particular attribute of button when user clicked 
            // on a particular the "data query" of that button will randered
            const query = this.getAttribute('data-query');

            // once the data-query is obtained its passed to the function fetchRecipes

            fetchRecipes(query);
        });
    });
});

// Function to fetch recipes based on the query

// async function is used for asynchronous programming like the execuation of other program does not Stops. 
async function fetchRecipes(query) {
    try {
        // Check if the recipe is already cached in localStorage

        // here localStorage,getItem is a method whixh is used to check the entered query by the side of the user is already 
        // presnet in cache or not like user typed "curry" this function will check curry has been present already or not in cache

        const cachedRecipe = localStorage.getItem(query);

        // if found then display the result of that particular recipe in a desired format which is to be defined in displayRecipes method
        if (cachedRecipe) {
            displayRecipes(JSON.parse(cachedRecipe));
        } else {
            // Fetch recipes from the API if not cached
            const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=1d41ac0be80e4219a08bbb456820c037`);
            const data = await response.json();

            //  if query is not found then search in the API and apply response.JSON method to convert 
            // it in JSON format and then set it into the local storage and the display a recipee
            localStorage.setItem(query, JSON.stringify(data.results));
            displayRecipes(data.results);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// Function to display the recipes

// creating a paramitrized function, the name of parameter is recipes
function displayRecipes(recipes) {

    // get the element of HTML whose name is recipe-container and then we will clear the previous results.
    const container = document.getElementById('recipe-container');
    container.innerHTML = ''; // Clear previous results

    // For each recipe, fetch detailed information and display it
    recipes.forEach(recipe => {
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=1d41ac0be80e4219a08bbb456820c037`)
            .then(response => response.json())
            .then(details => {

                // we can also create element in javascript like at the bottom line we are creating a "div" and store it into card.
                // after that we are giving the class name to that div which is recipe-card
                const card = document.createElement('div');
                card.className = 'recipe-card';

                // Set a default image if none is available
                const imageUrl = details.image || 'null';

                // we have an object in API's and from there we extract data in the 
                // form of key value pair like we are going with in the details and getting its value pricepersaving
                const pricePerServing = details.pricePerServing ? details.pricePerServing.toFixed(2) : 'N/A';

                // Create the card content
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${details.title}" onerror="this.onerror=null;this.src='null';">
                    <h3>${details.title || 'No title available'}</h3>
                    <p>Ingredients: ${details.extendedIngredients ? details.extendedIngredients.map(ing => ing.original).join(', ') : 'N/A'}</p>
                    <p>Price per serving: $${pricePerServing}</p>
                `;

                // Add click event to show recipe details
                card.addEventListener('click', () => {
                    showRecipeDetails(details.id);
                });
                container.appendChild(card);
            })
            .catch(error => {
                console.error('Failed to fetch recipe details:', error);
            });
    });
}

// Function to show detailed information of a selected recipe

// This part of code is optinal if we omit this then it doesn't effect to entire code this actually 
// shows a alert box with product title, thier summary and their instructions when user clicked on a particular card.
function showRecipeDetails(id) {
    fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=1d41ac0be80e4219a08bbb456820c037`)
        .then(response => response.json())
        .then(data => {
            alert(`
                Title: ${data.title || 'No title available'}
                Summary: ${data.summary ? data.summary.replace(/<\/?[^>]+(>|$)/g, "") : 'No summary available'}
                Instructions: ${data.instructions ? data.instructions.replace(/<\/?[^>]+(>|$)/g, "") : 'No instructions available'}
            `);
        })
        .catch(() => {
            alert('Failed to fetch recipe details.');
        });
}
