let searchParams = new URLSearchParams(location.search);
let result = searchParams.get('id');
parseInt(result)
const recipe_id = result.split('?')[0];
console.log(recipe_id);
//fetch the recipe from the server
fetch('/details', {
    method: 'POST',
    body: JSON.stringify({
        id: recipe_id
    }),
    headers: {
        'Content-Type': 'application/json'
    } 
})
.then(res => res.json())
.then(data => {
   console.log(data);
    const recipe_data = data.recipeData;
    const ingredient_data = data.ingredientDetails;
    console.log(recipe_data);
    console.log(ingredient_data);
    const recipe_name = document.querySelector('#detailed-pg');
    const section2 = document.querySelector('#steps')
    const section3 = document.querySelector('#ingredients')
    const recipe_tags = document.querySelector('#tags')
    recipe_data.forEach(element => {
      console.log(element.tags);
      const resizedImage = `data:image/png;base64,${element.image}`;
        let html = '';
        let html2 = '';
        let html3 = '';
        let tag_section = '';
        if(element.RecipeID == recipe_id){
            try{
                html +=`
                <div data-uk-grid>
    <div class="uk-width-1-2@s">
      <div><img class="uk-border-rounded-large" src="${resizedImage}" 
        alt="Image alt"></div>
    </div>
    <div class="uk-width-expand@s uk-flex uk-flex-middle">
      <div>
        <h1>${element.RecipeName}</h1>
        <p></p>
        <div class="uk-margin-medium-top uk-child-width-expand uk-text-center uk-grid-divider" data-uk-grid>
          <div>
            <span data-uk-icon="icon: clock; ratio: 1.4"></span>
            <h5 class="uk-text-500 uk-margin-small-top uk-margin-remove-bottom">Active Time</h5>
            <span class="uk-text-small">20 mins</span>
          </div>
          <div>
            <span data-uk-icon="icon: future; ratio: 1.4"></span>
            <h5 class="uk-text-500 uk-margin-small-top uk-margin-remove-bottom">Total Time</h5>
            <span class="uk-text-small">50 mins</span>
          </div>
          <div>
            <span data-uk-icon="icon: users; ratio: 1.4"></span>
            <h5 class="uk-text-500 uk-margin-small-top uk-margin-remove-bottom">Yield</h5>
            <span class="uk-text-small">Serves ${element.serving_size}</span>
          </div>
        </div>
        <hr>
        <div data-uk-grid>
          <div class="uk-width-auto@s uk-text-small">
            <p class="uk-margin-small-top uk-margin-remove-bottom"><a href="#">Little Green</a></p>
            <span class="uk-text-muted"></span>
          </div>
          <div class="uk-width-expand@s uk-flex uk-flex-middle uk-flex-right@s">
            <a href="recipe.html?save=${element.RecipeID}" class="uk-icon-link" data-uk-icon="icon: plus-circle; ratio: 1.2" 
             data-uk-tooltip="title: Save Recipe"></a>
            <a href="#" class="uk-icon-link uk-margin-left" data-uk-icon="icon: cart; ratio: 1.2" 
             data-uk-tooltip="title: Shopping List"></a>
            <a href="#" class="uk-icon-link uk-margin-left" data-uk-icon="icon: print; ratio: 1.2" 
             data-uk-tooltip="title: Print Recipe"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
    recipe_name.innerHTML = html;
    
    //Recipe tags
    const tags = element.tags;
    const tagsArray = tags.split(',');
    for(let i=0; i<tagsArray.length; i++){
      let tag = tagsArray[i];
      tag_section += `
      <a id="filter" class="uk-display-inline-block" href="index.html?id=${tag}"><span id="filter" class="uk-label uk-label-light rounded">${tag}</span></a>
      `;
      recipe_tags.innerHTML = tag_section;
    }

    //Recipe Instructions
    const instructions = element.RecipeInstructions
    const lines = instructions.split('\n');
    for(let i=0; i<lines.length; i++){
        let step = lines[i].replace(/^\d+\.\s/, "");
    html2 +=`
  <div id="step-${i}" class="uk-grid-small uk-margin-medium-top" data-uk-grid>
  <div class="uk-width-auto">
    <a href="#" class="uk-step-icon" data-uk-icon="icon: check; ratio: 0.8" 
      data-uk-toggle="target: #step-${i}; cls: uk-step-active"></a>
     </div>
    <div class="uk-width-expand">
    <h5 class="uk-step-title uk-text-500 uk-text-uppercase uk-text-primary" data-uk-leader="fill:—">${i + 1}.Step</h5>
    <div class="uk-step-content" id="step-${i}">${step}</div>
  </div>
 </div>
    `;
    section2.innerHTML = html2;
    }
    //Recipe Ingredients
    ingredient_data.forEach(ingredientArray => {
      ingredientArray.forEach(ingredient =>{
        html3 += `
          <li>${ingredient.IngredientName}</li>
    `;
    section3.innerHTML = html3;
      })
    });
    }
            catch(err){
                console.log(err);
            }
        }
    });
})
