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
    background: {default: '#f2f2f2', paper: '#F3F2EF'},
    primary: {main: '#474787', hover: 'rgba(71, 71, 135, 0.25)'},
    disabled: 'rgba(0, 0, 0, 0.3)',
    secondary: {main: '#2C2C54'},
    placeholder: 'rgba(0, 0, 0, 0.38)',
    grey: {main: '#595959'},
    danger: {
      dark: '#d32f2f',
      main: '#f44336',
      light: '#e57373'
    },
    warn: {
      dark: '#f57c00',
      main: '#ff9800',
      light: '#ffb74d'
    },
    success: {
      dark: '#388e3c',
      main: '#4caf50',
      light: '#81c784'
    },
    info: {
      dark: '#01579b',
      main: '#0288d1',
      light: '#03a9f4'
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
      <SessionProvider session={(pageProps as any).session}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Component {...pageProps} />
          </LocalizationProvider>
        </ThemeProvider>
      </SessionProvider>
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
