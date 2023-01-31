
fetch('/recipes', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'  
    },
})
.then(res => res.json())
.then(data => {
    console.log(data);
    const recipe = data;
    const recipeList = document.querySelector('#recipe-list');
    recipe.forEach(recipe => {
        let html = '';
        try{
            html += `<div>
            <div class="uk-card">
              <div class="uk-card-media-top uk-inline uk-light">
                <img class="uk-border-rounded-medium" src="https://via.placeholder.com/300x160" alt="Course Title">
                <div class="uk-position-cover uk-card-overlay uk-border-rounded-medium"></div>
                <div class="uk-position-xsmall uk-position-top-right">
                  <a href="#" class="uk-icon-button uk-like uk-position-z-index uk-position-relative"
                    data-uk-icon="heart"></a>
                </div>
              </div>
              <div>
                <h3 class="uk-card-title uk-text-500 uk-margin-small-bottom uk-margin-top">${recipe.RecipeName}</h3>
                <div class="uk-text-xsmall uk-text-muted" data-uk-grid>
                  <div class="uk-width-auto uk-flex uk-flex-middle">
                    <span class="uk-rating-filled" data-uk-icon="icon: star; ratio: 0.7"></span>
                    <span class="uk-margin-xsmall-left">5.0</span>
                    <span>(73)</span>
                  </div>
                  <div class="uk-width-expand uk-text-right">by Mamba</div>
                </div>
              </div>
              <a href="recipe.html?id=${recipe.RecipeID}" class="uk-position-cover"></a>
            </div>
          </div>`;
          recipeList.innerHTML += html;
        }
  
        catch(err){
            console.log(err);
        }
    })
    });