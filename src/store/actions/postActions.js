export const createPost = post => {
    return (dispatch, getState,{ getFirebase, getFirestore }) => {
        //Async Call
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('posts').add({
            ...post,
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({
                type: 'CREATE_POST', 
                payload: post
            })
        }).catch(err => {
            dispatch({
                type: 'CREATE_POST_ERROR',
                payload: err
            })
        })
    }
};