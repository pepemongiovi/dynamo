import {Stack} from '@mui/material'
import {FC, ReactNode} from 'react'

const Footer: FC<{
  children?: ReactNode
}> = ({children}) => <Stack>{children}</Stack>

export default Footer
