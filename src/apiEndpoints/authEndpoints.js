
const BASE_URL_DEV = 'http://localhost:8082/simlearn/authentication/api/v1';
const BASE_URL_PROD = 'https://production-domain'; // Replace with your actual production domain

const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEV;

const API_BASE_URL = BASE_URL;

export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/login`,
    VALIDATE_OTP : (email,otp) => `${API_BASE_URL}/validate/${email}/${otp}`,
    SEND_OTP : (email) => `${API_BASE_URL}/send-otp/${email}`,

    SIGNUP: `${API_BASE_URL}/account`,
    CHECK_USERNAME : (username) => `${API_BASE_URL}/username/${username}`,
    CHECK_EMAIL : (email) => `${API_BASE_URL}/email/${email}`,
    CHECK_EMAIL_FOR_USERNAME : (username,email) => `${API_BASE_URL}/password/forget/${username}/${email}`,
    RESET_PASSWORD : `${API_BASE_URL}/password`,
    UPDATE_PASSWORD : `${API_BASE_URL}/password/update/direct`,

    GET_INSTRUCTORS_ACCOUNTS : `${API_BASE_URL}/account/all-instructors`,
    
    SAVE_ENROLLED_GAME : (username) => `${API_BASE_URL}/account/games/${username}`,
    GET_ENROLLED_GAMES : (username) => `${API_BASE_URL}/account/games/${username}`,

    SAVE_PICTURE : (username) => `${API_BASE_URL}/profile-picture/${username}`,
    GET_PICTURE : (username) => `${API_BASE_URL}/profile-picture/${username}`,

    DELETE_ACCOUNT : (username) => `${API_BASE_URL}/account/${username}`,
    // ... other auth endpoints
};

