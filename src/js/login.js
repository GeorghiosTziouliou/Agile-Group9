const form = document.querySelector('#staff_login');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const error = document.querySelector('#error');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('submit');
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    if(emailValue === '' || passwordValue === ''){
        error.textContent = 'Please enter a valid email and password';
        return;
    }
    else{
        form.submit();
    }
});