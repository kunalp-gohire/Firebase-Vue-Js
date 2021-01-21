import  firebase from 'firebase/app';
import 'firebase/database'; // If using Firebase database
import 'firebase/firestore';  // If using Firebase storage
import 'firebase/storage';

var firebaseConfig = {
    //Add your firebase app configs
}
// Initialize Firebase
const firebaseApp= firebase.initializeApp(firebaseConfig)
const Firestore = firebaseApp.firestore()
Firestore.settings({timestampsInSnapshots :true})

export default Firestore;
