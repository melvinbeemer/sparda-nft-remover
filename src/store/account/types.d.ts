export interface AccountState {
  connected: boolean
  address?: string
  addressBase16?: string
}

export interface UpdateAccountStateProps extends Partial<AccountState> {}