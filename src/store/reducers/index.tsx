import { combineReducers } from "redux";
import login from './login';
import home from './home';

const RootReducer = combineReducers({
  login,
  home
});

export default RootReducer;