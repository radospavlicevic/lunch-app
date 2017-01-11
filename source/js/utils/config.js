import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDPMHHjCKaZugRm81iroiEYDG6jrxC2ZIA',
  authDomain: 'lunchapp-caeae.firebaseapp.com',
  databaseURL: 'https://lunchapp-caeae.firebaseio.com',
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
