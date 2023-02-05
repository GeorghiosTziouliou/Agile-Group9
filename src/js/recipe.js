let searchParam = new URLSearchParams(location.search);
let result = searchParam.get('id');
parseInt(result)
console.log(result);
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
      const recipeNmes = element.RecipeName;
      const recipeImages = element.RecipeImage;
      const recipeId = element.RecipeID
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
            <a class="like_recipe uk-icon-link" data-uk-icon="icon: plus-circle; ratio: 1.2" 
             data-uk-tooltip="title: Save Recipe"></a>
            <a href="#" class="uk-icon-link uk-margin-left" data-uk-icon="icon: print; ratio: 1.2" 
             data-uk-tooltip="title: Print Recipe"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
  const likeButton = document.querySelector('.like_recipe');
  likeButton.addEventListener('click', function() {
    const recipe = {
      name: '${element.RecipeName}',
      image: '${resizedImage}',
      servingSize: '${element.serving_size}'
    };
    localStorage.setItem('recipe', JSON.stringify(recipe));

    likeButton.setAttribute('data-uk-icon', 'icon: check; ratio: 1.2');
    likeButton.setAttribute('data-uk-tooltip', 'title: Recipe Saved');
    likeButton.setAttribute('class', 'uk-icon-link');

    likeButton.setAttribute('style', 'color: #4caf50');

  });
</script>
    `;
    recipe_name.innerHTML = html;
    // <a href="#" class="uk-icon-link uk-margin-left" data-uk-icon="icon: cart; ratio: 1.2" 
    //          data-uk-tooltip="title: Shopping List"></a>
    // const likeButton = document.querySelector('.like_recipe');
    // likeButton.addEventListener('click', function() {
    //   console.log('clicked');
    //   //get recipe id
    //   var likedRecipes = JSON.parse(localStorage.getItem("likedRecipes"));
    //   if(likedRecipes == null) {
    //     likedRecipes = [];
    //   }
    //   //get recipe data
    //   const recipe = {
    //     id: recipeId,
    //     image: recipeImages,
    //     name: recipeNmes
    //   };
    //   //push
    //   likedRecipes.push(recipe);
    //   //set
    //   localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
      // //change icon
      // likeButton.setAttribute('data-uk-icon', 'icon: check; ratio: 1.2');
      // likeButton.setAttribute('data-uk-tooltip', 'title: Recipe Saved');
      // likeButton.setAttribute('class', 'uk-icon-link');

      // //change color
      // likeButton.setAttribute('style', 'color: #4caf50');

    // }); 
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
//take some of the tags, send them to the database to get more recipes like this and display this recipes to the user
//more like this section
const moreLikeThis = document.querySelector('#more-like');
let html='';
// const tags = document.querySelector('#tags');
// const tag = tags.textContent;
// console.log('tags:' + tag);
const url = `/recipes`;
fetch(url)
.then((resp) => resp.json())
.then(function(data){
  const excludeID = recipe_id;
  data = data.filter(item => item.RecipeID != excludeID);
  data = data.sort(() => Math.random() -0.5);
  for(let i=0; i<4; i++){
    const element = data[i];
    const resizedImage = `data:image/png;base64,${element.image}`;
    html += `
<div>
<div
  class="uk-card">
  <div class="uk-card-media-top uk-inline uk-light">
    <img class="uk-border-rounded-medium" src="${resizedImage}" alt="Course Title">
    <div class="uk-position-cover uk-card-overlay uk-border-rounded-medium"></div>
    <div class="uk-position-xsmall uk-position-top-right">
      <a class="like uk-icon-button uk-like uk-position-z-index uk-position-relative"
        data-uk-icon="heart"></a>
    </div>
  </div>
  <div>
    <h3 class="uk-card-title uk-text-500 uk-margin-small-bottom uk-margin-top">${element.RecipeName}</h3>
    <div class="uk-text-xsmall uk-text-muted" data-uk-grid>
      <div class="uk-width-auto uk-flex uk-flex-middle">
      </div>
    </div>
  </div>
  <a href="recipe.html?id=${element.RecipeID}" class="uk-position-cover"></a>
</div>
</div>
`;
    moreLikeThis.innerHTML = html;
    // }
  }
  $(document).ready(function() {
    $(".like").click(function() {
        var recipeId = $(this).closest(".uk-card").find("a[href^='recipe.html?id=']").attr("href").split("=")[1];
        var recipeImage = $(this).closest(".uk-card").find("img").attr("src");
        var recipeName = $(this).closest(".uk-card").find(".uk-card-title").text();
        //add all this details on the local storage 'likedRecipes'
        var likedRecipes = JSON.parse(localStorage.getItem("likedRecipes"));
        if(likedRecipes == null){
          likedRecipes = [];
        }
        var recipe = {
          id: recipeId,
          image: recipeImage,
          name: recipeName
        };
        var recipeExists = likedRecipes.some(function(el){
          return el.id === recipeId;
        });
        if(!recipeExists){
          console.log("Does not exist, Adding");
        likedRecipes.push(recipe);
        localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes));
        }
        //delete already deleted items
        // localStorage.removeItem(savedRecipes);
        console.log("Already exists");
        console.log(likedRecipes);
        //change icon
        $(this).attr("data-uk-icon", "heart");
        //change color
        $(this).css("color", "red");
  
    });
  });
})
.catch(function(error){
    console.log(error);
});

//Recipe Comments