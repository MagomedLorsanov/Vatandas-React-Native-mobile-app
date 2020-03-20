import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyDxLtPJUaOTBF3TipjuRHhvP8fxYIGIFQY",
  authDomain: "vatandas-ee5d5.firebaseapp.com",
  databaseURL: "https://vatandas-ee5d5.firebaseio.com",
  projectId: "vatandas-ee5d5",
  storageBucket: "vatandas-ee5d5.appspot.com",
  messagingSenderId: "392858659075",
  appId: "1:392858659075:web:9868959a0b3cdf45"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  //firebase.firestore().settings({ timestampsInSnapshots: true });

  export default firebase;