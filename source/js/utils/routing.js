import { browserHistory } from 'react-router';

export function redirectTo(page) {
  browserHistory.push(page);
}
