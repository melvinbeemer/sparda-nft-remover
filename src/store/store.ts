import { Context, createWrapper } from "next-redux-wrapper";
import { createStore, Store } from 'redux'
import reducer from "./reducer";
import { RootState } from "./types";

export const makeStore = (context: Context) => {
  const store = createStore(reducer)
  return store
}

export const wrapper = createWrapper<Store<RootState>>(makeStore, {debug: false})