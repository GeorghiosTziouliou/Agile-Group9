fetch('/recipes', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const recipes = data;
        const recipeList = document.querySelector('#recipe-list');
        let html = `<div class="uk-margin">
                      <div class="uk-inline">
                        <span class="uk-form-icon" data-uk-icon="icon: search"></span>
                        <input class="uk-input" type="text" placeholder="Search..." id="recipe-search">
                      </div>
                    </div>`;
        html += `<div class="uk-child-width-1-3@m" uk-grid uk-lightbox="animation: slide">`;
        recipes.forEach(recipe => {
            const resizedImage = `data:image/png;base64,${recipe.image}`;
            try {
                html += `<div>
                            <div class="uk-card">
                              <div class="uk-card-media-top uk-inline uk-light">
                                <img class="uk-border-rounded-medium" src="${resizedImage}" alt="Course Title">
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
                                  </div>
                                </div>
                              </div>
                              <a href="recipe.html?id=${recipe.RecipeID}" class="uk-position-cover"></a>
                            </div>
                          </div>`;
            } catch (err) {
                console.log(err);
            }
        });
        html += `</div>`;
        recipeList.innerHTML = html;

        $('#recipe-search').on('keyup', function () {
            let value = $(this).val().toLowerCase();
            $('.uk-card').filter(function () {
                let text = $(this).find('.uk-card-title').text().toLowerCase();
                $(this).toggle(text.indexOf(value) > -1);
            });
        });
    })
