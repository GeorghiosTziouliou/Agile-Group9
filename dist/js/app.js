const form = document.querySelector('#form_data');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    //get form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value,key) =>{
        data[key] = value;
        console.log(data);
    });
    //send json data user data to the server to be validated and sent
    fetch('/mail',{
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
            alert('Message sent successfully');
            form.reset();
        }
        else{
            console.log('fail',);
            alert('Sorry there was an error sending your message, Please try again later');
        }
    })
    .catch(err => {
        console.log(err);
        alert('Sorry there was an error sending your message, Please try again later');
    });
    }
);