import { db } from 'utils/firebase_config';

export function saveCategory(category) {
  return db.ref('categories').push({
    name: category,
  });
}

export function removeCategory(key) {
  db.ref(`categories/${ key }`).remove();
}
