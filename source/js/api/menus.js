import { db } from 'utils/firebase_config';

export function saveDishInMenu(date, dish) {
  return db.ref(`menus/${ date }/${ dish.key }`).set(dish.data);
}

export function saveDishesInMenu(date, dishes) {
  Object.keys(dishes).forEach((key) => {
    saveDishInMenu(date, { 'key': key, data: dishes[key] });
  });
}

export function deleteDishFromMenu(date, key) {
  return db.ref(`menus/${ date }/${ key }`).remove();
}

export function updateDishInMenu(date, key, data) {
  return db.ref(`menus/${ date }/${ key }`).update(data);
}

export function switchMenuLock(date, lock) {
  return db.ref(`menus/${ date }`).set({ locked: lock });
}
