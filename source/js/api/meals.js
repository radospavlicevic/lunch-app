import { db } from 'utils/firebase_config';

export function saveCatering(name, contact) {
  return db.ref('caterings').push({
    name,
    contact,
  });
}

export function updateCatering(key, name, contact) {
  return db.ref(`caterings/${ key }`).update({ name, contact });
}

// export function updateCateringContact(key, contact) {
//   return db.ref(`caterings/${ key }`).update({ contact });
// }

export function removeCatering(key) {
  db.ref(`caterings/${ key }`).remove();
}

export function saveCategory(category) {
  return db.ref('categories').push({
    name: category,
  });
}

export function updateCategory(key, name) {
  return db.ref(`categories/${ key }`).update({ name });
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
