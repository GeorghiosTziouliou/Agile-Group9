const form = document.querySelector('#login-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');
    //get form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value,key) =>{
        data[key] = value;
        console.log(data);
    }
    );
    //send json data user data to the server to be validated and sent
    fetch('/login',{
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
            console.log('Login success');
            alert('Login successful');
            form.reset();
        }
        else{
            console.log('fail',);
            alert('Sorry there was an error logging you in, Please try again later');
        }
    }
    )
});