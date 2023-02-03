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
    recipe_data.forEach(element => {
      const resizedImage = `data:image/png;base64,${element.image}`;
        let html = '';
        let html2 = '';
        let html3 = '';
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
            <p class="uk-margin-small-top uk-margin-remove-bottom">Created by <a href="#">Alex Williamns</a></p>
            <span class="uk-text-muted">21 recipes</span>
          </div>
            <a href="https://pdf-ace.com/pdfme/" target= "_blank" class="uk-icon-link uk-margin-left" data-uk-icon="icon: print; ratio: 2.5" 
             data-uk-tooltip="title: Print to PDF"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
    recipe_name.innerHTML = html;
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
    // let IngredientName = [];
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
