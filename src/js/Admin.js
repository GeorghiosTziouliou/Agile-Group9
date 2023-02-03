

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
            html += `
            <tr>
      <td>${recipe.RecipeName}</td>
      <td>Ingredient 1, Ingredient 2</td>
      <td>${recipe.RecipeInstructions}</td>
      <td>
        <button class="btn btn-danger">Delete</button>
        <hr class="my-2 bg-secondary">
        <button class="btn btn-secondary"style="width:71px">Edit</button>
      </td>
    </tr>`;
          recipeList.innerHTML += html;
        }
  
        catch(err){
            console.log(err);
        }
    })
    });