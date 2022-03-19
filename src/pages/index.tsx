import type { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { AccountState, RootState } from 'store/types'
import WalletConnectButton from 'components/WalletConnectButton'
import { useEffect, useState } from 'react'
import { BN, fromBech32Address, toBech32Address, Zilliqa, Long, bytes } from '@zilliqa-js/zilliqa'
import { toBigNumber } from 'utils/bignumber'

const Home: NextPage = () => {
  let accountState = useSelector<RootState, AccountState>(state => state.account)
  let zilliqa = new Zilliqa('https://api.zilliqa.com')
  let [orders, setOrders] = useState<any[]>([])
  let [nonce, setNonce] = useState<number>(0)

  useEffect(() => {
    getOrderbook()
    
  // eslint-disable-next-line
  }, [])
  
  useEffect(() => {
    if(!accountState.address) return
    
    fetchUserData(accountState.address)
    getOrderbook()
  // eslint-disable-next-line
  }, [accountState])

  const fetchUserData = async (walletAddress: string) => {
    const stats = await zilliqa.blockchain.getBalance(fromBech32Address(walletAddress).replace('0x', ''))
    setNonce(stats.result.nonce)
  }

  const getOrderbook = async () => {
    let resp = await zilliqa.blockchain.getSmartContractSubState("4e5cb1a8eae44b6e1fe7c9468df1b47f45660c05", "orderbook", [])
    let orderbook = resp.result.orderbook
    // TODO: set back to account state

    var userOrders: any[] = []
    for(const [key, value] of Object.entries(orderbook)) {
      var order: any = value
      console.log(accountState.addressBase16)
      if(order.arguments[0] !== accountState.addressBase16?.toLowerCase()) continue
      order.listingId = key
      userOrders.push(order)
    }
    
    setOrders(userOrders)
  }

  let activeOrders = orders.filter(order => order.arguments[5].constructor.split('.')[1] === 'Active')

  const cancel = async (listingId: any) => {
    const zilPay = (window as any).zilPay
    const contract = zilPay.contracts.at(toBech32Address('0x4e5cb1a8eae44b6e1fe7c9468df1b47f45660c05'))

    const txn = await contract.call(
      'CancelListing',
      [
        {
          vname: 'item_order_id',
          type: 'Uint256',
          value: `${listingId}`,
        }
      ],
      { 
        amount: 0,
        nonce: nonce,
        version: bytes.pack(1,1), // Testnet: bytes.pack(333, 1)
        gasPrice: new BN(2500000000),
        gasLimit: Long.fromNumber(5000),
      },
      true
    )
    txn.id = txn.ID
    txn.isRejected = function (this: { errors: any[]; exceptions: any[] }) {
      return this.errors.length > 0 || this.exceptions.length > 0
    }

    setNonce(nonce+1)
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-xl font-bold mb-2">Sparda NFT Remover</h1>
      <p className="max-w-xl">The Sparda Wallet team rugpulled leaving their users and creators in the dust. Additionally they removed all listings from their website. This tiny dApp aims to give everyone the ability to remove their listings from the Sparda contract.</p>
      <div className="py-4">
        {accountState.connected ? (
          <p className="text-gray-500 italic">Logged in as {accountState.address}</p>
        ) : (
          <WalletConnectButton />
        )}
      </div>

      <div className="max-w-xl w-full mt-6">
        <div className="flex items-center font-semibold">
          <div className="flex-grow">Active listings: {activeOrders.length}</div>
          <div>Total listings: {orders.length}</div>
        </div>
        <div className="">
          {activeOrders.map(order => (
            <div key={order.listingId} className="p-2 bg-gray-200 rounded mb-2 flex items-center">
              <div className="flex-grow">
                Listing #{order.listingId}
              </div>
              <div>
                <button onClick={() => cancel(order.listingId)} className="text-blue-500 underline">Cancel listing</button>
              </div>
            </div>
          ))}
          {activeOrders.length === 0 &&
            <p className="text-gray-500 italic text-center py-3">You have no active listings on the Sparda marketplace :)</p>
          }
        </div>
      </div>
    </div>
  )
}

export default Home
