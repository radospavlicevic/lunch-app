import { db } from 'utils/firebase_config';
import { userSignedIn } from 'api/auth';

export function saveDishInOrder(date, dish) {
  return db.ref(`orders/${ date }/${ userSignedIn().uid }/meal/${ dish.category }`).set(dish.key);
}

export function deleteDishFromOrder(date, category) {
  return db.ref(`orders/${ date }/${ userSignedIn().uid }/meal/${ category }`).remove();
}

export function saveNoteInOrder(date, note) {
  return db.ref(`orders/${ date }/${ userSignedIn().uid }/note`).set(note);
}
