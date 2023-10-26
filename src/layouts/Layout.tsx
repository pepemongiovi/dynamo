import {FC, ReactNode} from 'react'
import Footer from '../components/Footer'
import {Box, Button, Stack, SxProps} from '@mui/material'
import Header from '../components/Header'
import trpc from '@/utils/trpc'

const maxWidth = 1350

const Layout: FC<{
  children?: ReactNode
  align?: 'center' | 'space-between' | 'start' | 'end'
  justify?: 'center' | 'space-between' | 'start' | 'end'
  direction?: 'row' | 'column'
  gap?: number
  sx?: SxProps
}> = ({children, direction = 'column', gap, justify, align, sx}) => {
  return (
    <Box
      id="layout"
      sx={{bgcolor: '#f2f2f2', height: '100%', minHeight: '100vh', ...sx}}
    >
      <Header maxWidth={maxWidth} />
      <Stack
        py={5}
        px={10}
        sx={{maxWidth, mx: 'auto'}}
        direction={direction}
        spacing={gap}
        justifyContent={justify}
        alignItems={align}
      >
        {children}
      </Stack>
      <Footer />
    </Box>
  )
}

export default Layout
