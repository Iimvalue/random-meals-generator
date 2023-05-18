$(document).ready(function () {

    // Pin variables to change his status   .
    let foodPin = true;
    let drinkPin = true;

    // #get-meal is a button to start the process of getting meal
    $('#get-meal').click(function (e) {
        e.preventDefault();
        if (foodPin || drinkPin === true) startToGetMeal();
    })

    // startToGetMeal function is start call function to fetch meal of food and drinks
    function startToGetMeal() {
        if (foodPin) {
            let mealType = $('input[name="optionsRadios"]:checked').val();
            fetchMeal('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + String(mealType), 'meals');
        }
        if (drinkPin)
            fetchMeal('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic', 'drinks');
    }

    // fetchMeal is a function to fetch API url as type of food or drink as array, send array to appendMealIntoDocument function.
    function fetchMeal(url, type) {
        $.get(url, function () {
        }).done(function (data) {
            if (type === 'meals')
                appendMealIntoDocument(data[type][parseInt(Math.random() * data[type].length)], type);
            else if (type === 'drinks')
                appendMealIntoDocument(data[type][parseInt(Math.random() * data[type].length)], type);
            else location.reload();
        })

    }

    // appendMealIntoDocument is a function to display a meal on website as card format
    function appendMealIntoDocument(data, type) {
        // data is variable array that receive from fetchMeal function.
        // type is variable that receive from fetchMeal for deals with data index name.

        // numbering is numbering specific class name as 1 or 2
        let numbering = '';

        // for reaching the specific array name, must change type variable
        type === 'meals' ? numbering = '1' : numbering = '2';
        type === 'meals' ? type = 'Meal' : type = 'Drink';


        $('#meal .card-' + numbering).html(`
            <div class="card">
                    <button type="button" id='toolTip-${numbering}' class="btn btn-success col-12 position-absolute w-auto">Ingredients</button>
                    <img src= ${data['str' + type + 'Thumb']} class="card-img-top img-responsive" alt="...">
                    <div class="card-body h-auto w-auto">
                        <h5 class="card-title">${data['str' + type]}</h5>
                    </div>
                    <button class='pin-${numbering} btn btn-success w-auto'>Pin</button>

                </div>
        `)

        pinStatus();
        addIngredientsIntoTooltipButton(data);

    }

    // pinStatus is a function to check the status of Pin button is it pinned or not
    function pinStatus() {

        //Pin appendMealIntoDocument
        $('.pin-1').unbind('click').click(function () {
            foodPin = !foodPin;
            $('.pin-1').text(foodPin ? 'Pin' : 'Pinned')
        })

        $('.pin-2').unbind('click').click(function () {
            drinkPin = !drinkPin;
            $('.pin-2').text(drinkPin ? 'Pin' : 'Pinned')
        })
    }

    // addIngredientsIntoTooltipButton is a function to add Ingredients into a toolTip button
    function addIngredientsIntoTooltipButton(data) {
        // data is variable array that receive from appendMealIntoDocument function for fetch ingredients.

        if ('strMeal' in data) {
            $.get('https://www.themealdb.com/api/json/v1/1/search.php?s=' + data['strMeal'], function (data) {
                let ingredients = [];

                for (let i = 1; i <= 20; i++) {
                    let ingredientName = data['meals'][0]['strIngredient' + String(i)];
                    if (!(ingredientName === null) && !(ingredientName === '')) {
                        ingredients.push(data['meals'][0]['strIngredient' + String(i)]);
                    }
                }
                $('#toolTip-1').tooltip({
                    title: `<h3>${data['meals'][0]['strMeal']}</h3>
                            <h5>Ingredients</h5>
                            <p>${ingredients}</p>`,
                    html: true,
                    trigger: 'hover',

                    template: `<div class="tooltip">
                                   <div class="tooltip-inner"></div>
                                   </div> `
                });
            })
        }
        if ('strDrink' in data) {
            $.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + data['strDrink'], function (data) {
                let ingredients = [];

                for (let i = 1; i <= 15; i++) {
                    let ingredientName = data['drinks'][0]['strIngredient' + String(i)];
                    if (!(ingredientName === null) && !(ingredientName === '')) {
                        ingredients.push(data['drinks'][0]['strIngredient' + String(i)]);
                    }
                }

                $('#toolTip-2').tooltip({
                    title: `<h4>${data['drinks'][0]['strDrink']}</h4>
                            <h6>Ingredients</h6>
                            <p>${ingredients}</p>`,
                    html: true,
                    trigger: 'hover',
                    template: `<div class="tooltip">
                                   <div class="tooltip-inner"></div>
                                   </div> `
                });
            })
        }
    }
});