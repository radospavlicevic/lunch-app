import { db } from 'utils/firebase_config';

export function saveCatering(catering) {
  return db.ref('caterings').push(catering);
}

export function removeCatering(key) {
  db.ref(`caterings/${ key }`).remove();
}

export function saveCategory(category) {
  return db.ref('categories').push({
    name: category,
  });
}

export function removeCategory(key) {
  db.ref(`categories/${ key }`).remove();
}

export function saveDish(dish) {
  return db.ref('dishes').push(dish);
}

export function updateDish(key, dish) {
  return db.ref(`dishes/${ key }`).update(dish);
}

export function removeDish(key) {
  db.ref(`dishes/${ key }`).remove();
}
