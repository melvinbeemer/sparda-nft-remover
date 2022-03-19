import { AccountState } from "./account/types";

export * from "./account/types";

export interface RootState {
  account: AccountState
}