import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyCwFo0HrQwd3yFoGHNfsaQpOSo1hREiHUY",
    authDomain: "stonksorbital.firebaseapp.com",
    projectId: "stonksorbital",
    storageBucket: "stonksorbital.appspot.com",
    messagingSenderId: "523080346812",
    appId: "1:523080346812:web:3ad2d7ff3b624dcd6034b9"
};

const fire = firebase.initializeApp(firebaseConfig);
export default fire