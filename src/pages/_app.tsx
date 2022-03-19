import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { wrapper } from 'store/store'
import AccountProvider from 'components/AccountProvider'

function WrappedApp({ Component, pageProps }: AppProps) {
  return (
    <AccountProvider>
      <Component {...pageProps} />
    </AccountProvider>
  )
}

export default wrapper.withRedux(WrappedApp)
