const handleErrors = (err)=>{
    console.log(err.message, err.code);
    let errors = { fullName:'', email:'', password:'', countryOfResidence:''}
    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
    }
    //incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }
    //duplicate error code
    if(err.code === 11000){
        errors.email = 'that email is already registered';
        return errors;
    }
    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}
module.exports = {handleErrors}