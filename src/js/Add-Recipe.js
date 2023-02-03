const form = document.querySelector('.add-recipe-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('form submitted');

    //get form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value,key) =>{
        data[key] = value;
        console.log(data);
    });
    //send json data user data to the server to be validated and sent
    fetch('/AddRecipes',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    //listen out for the response from the server and inform user
    .then(res => res.json())
    .then(data => {
        if(data.message == 'success'){
            console.log('success');
            alert('Added successfully');
            form.reset();
        }
        else{
            console.log('fail',);
            alert('Sorry there was an error adding, Please try again later');
        }
    })
    .catch(err => {
        console.log(err);
        alert('Sorry there was an error adding, Please try again later');
    });
    }
);