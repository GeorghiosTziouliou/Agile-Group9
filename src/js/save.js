$(document).ready(function() {
    var savedRecipes = localStorage.getItem("likedRecipes");
    if (savedRecipes) {
      savedRecipes = JSON.parse(savedRecipes);
        const recipeList = document.querySelector('#Liked_page');
            for(var i=0; i<savedRecipes.length; i++){
            console.log(savedRecipes);
            var recipeId = savedRecipes[i];
            var recipeImage = savedRecipes[i];
            var recipeName = savedRecipes[i];
            let recipeImg = recipeImage.image;
            let recipeNme = recipeName.name;
            let html = '';
            try{
                html += `<div>
                <div class="uk-card">
                    <div class="uk-card-media-top uk-inline uk-light">
                    <img class="uk-border-rounded-medium" src="${recipeImg}" alt="Course Title">
                    <div class="uk-position-cover uk-card-overlay uk-border-rounded-medium"></div>
                    <div class="uk-position-xsmall uk-position-top-right">
                        <a class="like uk-icon-button uk-like uk-position-z-index uk-position-relative"
                        data-uk-icon="heart"></a>
                    </div>
                    </div>
                    <div>
                    <h3 class="uk-card-title uk-text-500 uk-margin-small-bottom uk-margin-top">${recipeNme}</h3>
                    <div class="uk-text-xsmall uk-text-muted" data-uk-grid>
                        <div class="uk-width-auto uk-flex uk-flex-middle">
                        <span class="uk-rating-filled" data-uk-icon="icon: star; ratio: 0.7"></span>
                        <span class="uk-margin-xsmall-left">5.0</span>
                        <span>(73)</span>3
                        </div>
                        <div class="uk-width-expand uk-text-right">Little Green</div>
                    </div>
                    </div>
                    <a href="recipe.html?id=${recipeId.id}" class="uk-position-cover"></a>
                </div>
                </div>`;
                recipeList.innerHTML += html;
            }
            catch(err){
                console.log(err);
            }
        }
};

    $(document).ready(function() {
        $(".like").click(function() {
            var recipeId = $(this).closest(".uk-card").find("a[href^='recipe.html?id=']").attr("href").split("=")[1];
            console.log(recipeId);
            //remove the data from local storage when button is clicked
            var savedRecipes = localStorage.getItem("likedRecipes");
            if (savedRecipes) {
                savedRecipes = JSON.parse(savedRecipes);
                var index = savedRecipes.indexOf(recipeId);
                if (index > -1) {
                    savedRecipes.slice(index, 3);
                }
                localStorage.setItem("likedRecipes", JSON.stringify(savedRecipes));
                localStorage.removeItem(savedRecipes);
            }
            //remove the card from the page
            $(this).closest(".uk-card").remove();``
            //change icon
            $(this).attr("data-uk-icon", "heart");
            //change color
            $(this).css("color", "red");
  
        });
    });


})














// var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
// // Loop through the saved items array and display each saved recipe
// for (var i = 0; i < savedRecipes.length; i++) {
//   var recipeId = savedRecipes[i];
//     var recipe = getRecipeById(recipeId);
//     console.log("All saved");
//     console.log(recipe);
//     const recipeList = document.querySelector('#Liked_page');
//     const resizedImage = `data:image/png;base64,${recipe.image}`;
//     let html = '';
//     try{
//         html += `<div>
//         <div class="uk-card">
//           <div class="uk-card-media-top uk-inline uk-light">
//             <img class="uk-border-rounded-medium" src="${resizedImage}" alt="Course Title">
//             <div class="uk-position-cover uk-card-overlay uk-border-rounded-medium"></div>
//             <div class="uk-position-xsmall uk-position-top-right">
//               <a class="like uk-icon-button uk-like uk-position-z-index uk-position-relative"
//                 data-uk-icon="heart"></a>
//             </div>
//           </div>
//           <div>
//             <h3 class="uk-card-title uk-text-500 uk-margin-small-bottom uk-margin-top">${recipe.RecipeName}</h3>
//             <div class="uk-text-xsmall uk-text-muted" data-uk-grid>
//               <div class="uk-width-auto uk-flex uk-flex-middle">
//                 <span class="uk-rating-filled" data-uk-icon="icon: star; ratio: 0.7"></span>
//                 <span class="uk-margin-xsmall-left">5.0</span>
//                 <span>(73)</span>3
//               </div>
//               <div class="uk-width-expand uk-text-right">Little Green</div>
//             </div>
//           </div>
//           <a href="recipe.html?id=${recipe.RecipeID}" class="uk-position-cover"></a>
//         </div>
//       </div>`;
//       recipeList.innerHTML += html;
//     }
//     catch(err){
//         console.log(err);
//     }
// }
