let searchParams = new URLSearchParams(window.location.search);
let id = searchParams.get('id');
console.log(id);
//fetch the recipe from the server
fetch('/recipe?id=' + id)
.then(res => res.json())
.then(data => {
    console.log(id, 'details\n', data);
})
