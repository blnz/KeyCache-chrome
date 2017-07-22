import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

const Api = {};

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {
  try {
    const user = yield call(Api.fetchUser, action.payload.userId);
    yield put({ type: 'USER_FETCH_SUCCEEDED', user: user });
  } catch (e) {
    yield put({ type: 'USER_FETCH_FAILED', message: e.message });
  }
}

/*
 Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
 Allows concurrent fetches of user.
 */
function* mySaga() {
  console.log(' entered mySaga');
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
  // or yield takeLatest('USER_FETCH_REQUESTED', fetchUser);
}


export default mySaga;
