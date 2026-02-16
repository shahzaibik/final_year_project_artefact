enum APIRoutes {
    // Authentication routes
    AUTH_SIGNUP = "/api/auth/signup", // signup route
    AUTH_LOGIN = "/api/auth/login", // login route
    AUTH_LOGOUT = "/api/auth/logout", // logout route
    AUTH_ME = "/api/auth/me",
    AUTH_PROFILE = "/api/auth/profile", // profile route
    AUTH_UPLOAD_PROFILE_IMAGE = "/api/auth/upload-profile-image", // upload profile image route
    AUTH_UPLOAD_AGREEMENT = "/api/auth/upload-agreement", // upload agreement route
    AUTH_FORGOT_PASSWORD = "/api/auth/forgot-password", // forgot password route    
    AUTH_RESET_PASSWORD = "/api/auth/reset-password", // reset password route
    API_SUBSCRIBE = "/api/subscribe", // subscribe route
    TENANTS = "/api/tenants", // tenants route
    ISSUES = "/api/issues", // issues route
    HANDYMEN = "/api/handymen", // handymen route
    NOTIFICATIONS = "/api/notifications", // notifications route
}

export default APIRoutes;