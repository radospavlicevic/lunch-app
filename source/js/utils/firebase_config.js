import firebase from 'firebase';

// window.firebase = firebase;

const config = process.env.NODE_ENV === 'production' ?
{ apiKey: 'AIzaSyDPMHHjCKaZugRm81iroiEYDG6jrxC2ZIA',
  authDomain: 'lunchapp-caeae.firebaseapp.com',
  databaseURL: 'https://lunchapp-caeae.firebaseio.com',
  storageBucket: 'lunchapp-caeae.appspot.com',
  messagingSenderId: '877744910577',
} :
{
  apiKey: 'AIzaSyC_VOK0ioiCtemnbdo887uO8sh2S_VlNCI',
  authDomain: 'developlunchapp.firebaseapp.com',
  databaseURL: 'https://developlunchapp.firebaseio.com',
  projectId: 'developlunchapp',
  storageBucket: 'developlunchapp.appspot.com',
  messagingSenderId: '845336258883',
};


firebase.initializeApp(config);

export const db = firebase.database();
export const firebaseAuth = firebase.auth;
