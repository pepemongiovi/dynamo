import {requireBuildEnv} from '@/server/utils'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import {ToastContainer} from 'react-toastify'
import {SessionProvider} from 'next-auth/react'
import {createTheme, ThemeProvider} from '@mui/material'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'

const theme = createTheme({
  typography: {
    fontFamily: 'Sofia Pro'
  },
  palette: {
    background: {default: '#f2f2f2'},
    primary: {main: '#474787'},
    disabled: 'rgba(0, 0, 0, 0.3)',
    secondary: {main: '#2C2C54'},
    placeholder: '#595959',
    danger: {
      main: '#f44336',
      hover: '#ffdddd'
    },
    warn: {
      main: '#ffeb3b',
      hover: '#ffffcc'
    },
    success: {
      main: '#28a745',
      hover: '#4CAF50'
    },
    info: {
      main: '#ddffff',
      hover: '#2196F3'
    }
  } as any
})

const recaptchaSiteKey = requireBuildEnv(
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
)

const App = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <SessionProvider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Component {...pageProps} />
          </LocalizationProvider>
        </ThemeProvider>
      </SessionProvider>
      <ToastContainer position="bottom-left" />
    </>
  )
}

export default App
