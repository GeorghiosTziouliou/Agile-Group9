let searchParams = new URLSearchParams(location.search);
let result = searchParams.get('id');

let fetchPromise;
if(!result){
    fetchPromise = fetch('/recipes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'  
        },
    });
}else{
    const filter = result.split('?')[0];
    console.log(filter);
    fetchPromise = fetch(`/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tags:filter
        })
    });
}
fetchPromise
// fetch('/recipes', {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json'  
//     },
// })
.then(res => res.json())
.then(data => {
    console.log(data);
    const recipe = data;
    const recipeList = document.querySelector('#recipe-list');
    // const categories = document.querySelector('#categories');
    recipe.forEach(recipe => {
        const resizedImage = `data:image/png;base64,${recipe.image}`;
        let html = '';
        try{
            html += `<div>
            <div class="uk-card">
              <div class="uk-card-media-top uk-inline uk-light">
                <img class="uk-border-rounded-medium" src="${resizedImage}" alt="Course Title">
                <div class="uk-position-cover uk-card-overlay uk-border-rounded-medium"></div>
                <div class="uk-position-xsmall uk-position-top-right">
                  <a class="like uk-icon-button uk-like uk-position-z-index uk-position-relative"
                    data-uk-icon="heart"></a>
                </div>
              </div>
              <div>
                <h3 class="uk-card-title uk-text-500 uk-margin-small-bottom uk-margin-top">${recipe.RecipeName}</h3>
                <div class="uk-text-xsmall uk-text-muted" data-uk-grid>
                  <div class="uk-width-auto uk-flex uk-flex-middle">
                    <span class="uk-rating-filled" data-uk-icon="icon: star; ratio: 0.7"></span>
                    <span class="uk-margin-xsmall-left">5.0</span>
                    <span>(73)</span>3
                  </div>
                  <div class="uk-width-expand uk-text-right">Little Green</div>
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
          console.log("Already exists");
          console.log(likedRecipes);
          //change icon
          $(this).attr("data-uk-icon", "heart");
          //change color
          $(this).css("color", "red");

      });
  });
});




//           // //check if the recipe is already liked/saved in the local storage
//           // var likedRecipes = JSON.parse(localStorage.getItem("likedRecipes"));
//           // if(likedRecipes == null){
//           //   likedRecipes = [];
//           //   console.log("likedRecipes is null");
//           // }
//           // //add the current recipe to the saved items array
//           // likedRecipes.push(recipeId);
//           // //save the array to the local storage
//           // localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes));
//           // console.log(likedRecipes);
//           // //change icon
//           // $(this).attr("data-uk-icon", "heart");
//           // //change color
//           // $(this).css("color", "red");

//       });
//   });
// });