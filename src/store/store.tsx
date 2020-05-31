import { createStore, applyMiddleware } from 'redux';
import RootReducer from './reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import AuthenticationMiddleware from '../middlewares/authentication.middleware';

const Store = createStore(
  RootReducer,
  composeWithDevTools(
    applyMiddleware(thunk, AuthenticationMiddleware)
  )
);

export default Store;