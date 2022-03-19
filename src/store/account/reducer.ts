import { AccountState, UpdateAccountStateProps } from "./types";
import { AnyAction } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { AccountActionTypes } from "./actions";

const initialState: AccountState = {
  connected: false,
  address: undefined,
  addressBase16: undefined
}

const reducer = (state: AccountState = initialState, action: AnyAction) => {
  const { payload } = action

  switch(action.type) {
    case HYDRATE:
      return {...state, ...action.payload.account}

    case AccountActionTypes.UPDATE_ACCOUNT_STATE:
      const updateStateProps: UpdateAccountStateProps = payload
      return {
        ...state,
        ...updateStateProps
      }

    default:
      return state
  }
}

export default reducer