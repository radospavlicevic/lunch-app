import firebase from 'firebase';

window.firebase = firebase;

const config = {
  apiKey: 'AIzaSyDPMHHjCKaZugRm81iroiEYDG6jrxC2ZIA',
  authDomain: 'lunchapp-caeae.firebaseapp.com',
  databaseURL: 'https://lunchapp-caeae.firebaseio.com',
  storageBucket: 'lunchapp-caeae.appspot.com',
  messagingSenderId: '877744910577',
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
