import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAccountState } from "store/account/actions";

interface Props {
  children: React.ReactNode
}

const AccountProvider = (props: Props) => {
  let dispatch = useDispatch()

  useEffect(() => {
    if(localStorage.getItem('zilPay') === 'true') {
      connectZilPay()
    }
  // eslint-disable-next-line
  }, [])

  const connectZilPay = async () => {
    let zilPay = (window as any).zilPay
    
    // Check if ZilPay is installed
    if(typeof zilPay === "undefined") {
      console.log("ZilPay extension not installed")
      return
    }
      
    let result = await zilPay.wallet.connect()

    if(result !== zilPay.wallet.isConnect) {
      console.log("Could not connect to ZilPay")
      return
    }

    dispatch(updateAccountState({
      connected: true,
      address: zilPay.wallet.defaultAccount.bech32,
      addressBase16: zilPay.wallet.defaultAccount.base16
    }))
  }

  return <>{props.children}</>
}

export default AccountProvider