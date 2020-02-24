import firebase from "@firebase/app";
import "@firebase/firestore";

const config = {
    apiKey: "AIzaSyBx6PwyRXjbgrm_iCTtPfpQ0l7LTvgGZZ4",
    authDomain: "quick-todo-17aa4.firebaseapp.com",
    databaseURL: "https://quick-todo-17aa4.firebaseio.com",
    projectId: "quick-todo-17aa4",
    storageBucket: "quick-todo-17aa4.appspot.com"
}

const app = firebase.initializeApp(config);
const firestore = firebase.firestore(app);

export default firestore;