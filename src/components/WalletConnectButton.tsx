import React from "react";
import { useDispatch } from "react-redux";
import { updateAccountState } from "store/account/actions";

const WalletConnectButton = () => {
  let dispatch = useDispatch()

  const handleOnClick = () => {
    connectZilPay()
  }

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

    localStorage.setItem('zilPay', 'true')
  }

  return (
    <button 
      onClick={() => handleOnClick()}
      className="bg-gray-200 rounded p-2 font-medium"
    >
      Connect ZilPay
    </button>
  )
}

export default WalletConnectButton