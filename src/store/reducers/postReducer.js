const initState = {
    posts: null
};

const postReducer = (state = initState , action) => {
    switch(action.type){
        case 'CREATE_POST':
            console.log('created post',action.payload);
            return state;
        case 'CREATE_POST_ERROR':
            console.log('create post error', action.payload);
            return state;
        default: 
            return state;
    }
}

export default postReducer;