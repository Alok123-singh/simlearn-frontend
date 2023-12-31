import { AUTH_ENDPOINTS } from '../../apiEndpoints'
import { config } from '../../configurations';

async function resetPassword( 
    data,
    navigate = (...input) => {},
    setLoading = (...input) => {}, 
    setErrors = (...input) => {},
) {

    setLoading(true);
    // console.log(data);
    setErrors([]);

    let status = false;

    let errors = [];

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&^#(){}[\]:;<>,.?/~_+\-=|\\\"'`!^&*()$%^,{}?<>_])[A-Za-z\d@$!%*?&^#(){}[\]:;<>,.?/~_+\-=|\\\"'`!^&*()$%^,{}?<>_ ]{5,}$/.test(data.newPassword)) {
        errors.push("New password must have at least 1 special character, 1 small alphabet, 1 capital alphabet, 1 digit, and at least 5 characters long");
        setLoading(false);
        setErrors(errors);
        return;
    }

    if(data.newPassword === data.oldPassword){
        errors.push("Enter a new password")
        setLoading(false);
        setErrors(errors);
        return;
    }

    try{
        const credentials = btoa(config.username + ':' + config.password);
        const response = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
                'Authorization': `Basic ${credentials}`,
                // Add any other headers if needed
            },
            body: JSON.stringify(data), // Convert the data to a JSON string
        });
        // const data2 = await response.json();
        // console.log("Response",response);
        
        if(response.status === 200){
            alert('Password has been reset successfully');
            // console.log("Reset Successfull");
            navigate('/profile');
            status = true;
        }
        else{
            errors.push('Invalid username or password');
            // console.log("Reset Failed");
        }

    }
    catch(error){
        // console.log("Reset Password Error :",error);
        errors.push(error);
    }

    if (errors.length > 0) {
        setErrors(errors);
    }

    setLoading(false);

    return (status);
};

export default resetPassword;