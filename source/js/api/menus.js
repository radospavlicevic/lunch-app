import { db } from 'utils/firebase_config';

export function saveDishInMenu(date, dish) {
  return db.ref(`menus/${ date }/${ dish.key }`).set(dish.data);
}

export function saveDishesInMenu(date, dishes) {
  Object.keys(dishes).forEach((key) => {
    saveDishInMenu(date, { 'key': key, data: dishes[key] });
  });
}

export function daleteDishFromMenu(date, key) {
  return db.ref(`menus/${ date }/${ key }`).remove();
}
