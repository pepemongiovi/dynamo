import {
  Box,
  Button as MuiButton,
  ButtonProps as BtnProps,
  CircularProgress
} from '@mui/material'
import {FC} from 'react'

type ButtonProps = BtnProps & {
  loading?: boolean
  danger?: boolean
}

const Button: FC<ButtonProps> = ({sx, danger, children, loading, ...props}) => (
  <MuiButton
    variant={danger ? 'outlined' : 'contained'}
    sx={{
      height: 45,
      borderRadius: 2.5,
      color: danger ? 'danger.main' : 'white',
      borderColor: danger ? 'danger.main' : 'black',
      '&:hover': {
        borderColor: danger ? 'danger.main' : 'black',
        bgcolor: danger ? 'danger.hover' : undefined
      },
      ...sx
    }}
    {...props}
  >
    <Box sx={{visibility: loading ? 'hidden' : 'visible'}}>{children}</Box>
    {loading && (
      <CircularProgress size={25} sx={{position: 'absolute', color: 'white'}} />
    )}
  </MuiButton>
)

export default Button
