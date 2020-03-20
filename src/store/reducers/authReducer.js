const initState = {
    isLoginSuccess: false,
    activeUser: null
};

const authReducer = (state = initState , action) => {
    switch(action.type){
        case 'LOGIN_ERROR':
            return {
                ...state,
                authError: action.payload
            }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                authError: null ,
                isLoginSuccess: true,
                activeUser: action.payload
            }
        case 'SIGNOUT_SUCCESS':
           return state;
        case 'SIGNUP_SUCCESS':
            return{
                ...state,
                authError: null
            }
        case 'SIGNUP_ERROR':
            return{
                ...state,
                authError: action.payload.message
            }
        default: 
            return state;
    }
}

export default authReducer;