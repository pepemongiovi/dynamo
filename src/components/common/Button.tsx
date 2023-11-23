import {
  Box,
  Button as MuiButton,
  ButtonProps as BtnProps,
  CircularProgress
} from '@mui/material'
import {FC} from 'react'

type ButtonProps = Omit<BtnProps, 'size'> & {
  loading?: boolean
  danger?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const Button: FC<ButtonProps> = ({
  sx,
  size = 'md',
  danger,
  children,
  loading,
  ...props
}) => {
  const getHeight = () => {
    switch (size) {
      case 'xs':
        return 30
      case 'sm':
        return 35
      case 'md':
        return 45
      case 'lg':
        return 50
      default:
        return 40
    }
  }

  return (
    <MuiButton
      variant={danger ? 'outlined' : 'contained'}
      sx={{
        height: getHeight(),
        borderRadius: 2.5,
        color: danger
          ? 'danger.main'
          : props.variant === 'outlined'
          ? 'primary.mainb'
          : 'white',
        borderColor: danger ? 'danger.main' : 'primary.main',
        '&:hover': {
          borderColor: danger ? 'danger.main' : 'black',
          bgcolor: danger
            ? 'danger.light'
            : props.variant === 'outlined'
            ? 'primary.light'
            : undefined
        },
        ...sx
      }}
      {...props}
    >
      <Box sx={{visibility: loading ? 'hidden' : 'visible'}}>{children}</Box>
      {loading && (
        <CircularProgress
          size={25}
          sx={{position: 'absolute', color: 'white'}}
        />
      )}
    </MuiButton>
  )
}

export default Button
