import { UpdateAccountStateProps } from "./types";

export const AccountActionTypes = {
  UPDATE_ACCOUNT_STATE: "UPDATE_ACCOUNT_STATE"
}

export function updateAccountState(payload: UpdateAccountStateProps) {
  return {
    type: AccountActionTypes.UPDATE_ACCOUNT_STATE,
    payload
  }
}