import { db } from 'utils/firebase_config';

export function saveCategory(category) {
  return db.ref('category').push({
    name: category,
  });
}

export function removeCategory() {
}
