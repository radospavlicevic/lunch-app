import { db } from 'utils/firebase_config';

class ObservableModule {

  attachStore(store) {
    this.store = store;
  }

  dispatchAction(action, actionArgs, snapshot, param) {
    switch (actionArgs) {
      case 2:
        this.store.dispatch(action(snapshot.key, snapshot.value));
        break;
      case 3:
        this.store.dispatch(action(param, snapshot.key, snapshot.value));
        break;
      default:
        this.store.dispatch(action(snapshot.value));
    }
  }

  // selector - Firebase selector to database
  // actionArgs represents number of arguments which should be passed to action
  // action - action should be dispatched when observer triggers
  // actionParam - additional action params over data provided by FB snapshot

  addValueObserver(selector, action, actionArgs = 1, actionParam = null) {
    db.ref(selector).on('value', snapshot => {
      this.dispatchAction(
        action, actionArgs, { key: snapshot.key, value: snapshot.val() }, actionParam
      );
    });
  }

  addValueCounterObserver(selector, valAction, counterAction) {
    db.ref(selector).on('value', snapshot => {
      this.store.dispatch(valAction(snapshot.val()));
      this.store.dispatch(counterAction(snapshot.numChildren()));
    });
  }

  addChildAddedObserver(selector, action, actionArgs = 2, actionParam = null) {
    db.ref(selector).on('child_added', snapshot => {
      this.dispatchAction(
        action, actionArgs, { key: snapshot.key, value: snapshot.val() }, actionParam
      );
    });
  }

  addChildRemovedObserver(selector, action, actionArgs = 1, actionParam = null) {
    db.ref(selector).on('child_removed', snapshot => {
      this.dispatchAction(
        action, actionArgs, { key: snapshot.key, value: snapshot.val() }, actionParam
      );
    });
  }

  addChildChangedObserver(selector, action, actionArgs = 2, actionParam = null) {
    db.ref(selector).on('child_changed', snapshot => {
      this.dispatchAction(
        action, actionArgs, { key: snapshot.key, value: snapshot.val() }, actionParam
      );
    });
  }

  addCascadingObserver(selector, observerType, action, cascadingCallback) {
    if (observerType === 'child_changed') {
      db.ref(selector).on(observerType, snapshot => {
        this.store.dispatch(action(snapshot.key, snapshot.val()));
        cascadingCallback(snapshot.key, snapshot.val());
      });
    }
    if (observerType === 'child_removed') {
      db.ref(selector).on(observerType, snapshot => {
        this.store.dispatch(action(snapshot.key));
        cascadingCallback(snapshot.key);
      });
    }
  }
}

export const observableModule = new ObservableModule();
