import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import {signOut, useSession} from 'next-auth/react'
import Button from './common/Button'
import {useRouter} from 'next/router'
import {Stack} from '@mui/material'

type HeaderProps = {
  maxWidth: number
}
const Header: React.FC<HeaderProps> = ({maxWidth}) => {
  const router = useRouter()
  const session = useSession()

  const [auth, setAuth] = React.useState(session.status === 'authenticated')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const goToLogin = () => router.push('/app/login')

  const handleLogout = async () => {
    await signOut()
    setAuth(false)
    handleClose()
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const showLoginBtn = () => router.asPath !== '/app/login'

  const gotToDashboard = () => router.push('/app/dashboard')

  React.useEffect(() => {
    setAuth(session.status === 'authenticated')
  }, [session.status])

  return (
    <AppBar
      position="sticky"
      sx={{px: 10, display: 'flex', alignItems: 'center'}}
    >
      <Toolbar sx={{maxWidth, width: 1}}>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{mr: 2}}
        >
          <MenuIcon />
        </IconButton> */}

        <Box onClick={gotToDashboard} sx={{flexGrow: 1}}>
          <Typography
            variant="h6"
            component="div"
            sx={{cursor: 'pointer', width: 80}}
          >
            Dynamo
          </Typography>
        </Box>

        {auth ? (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={handleMenu}
            sx={{cursor: 'pointer'}}
          >
            <Typography>{session.data?.user?.name}</Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              sx={{pr: 0}}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} sx={{width: 120}}>
                Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{color: 'red'}}>
                Sair
              </MenuItem>
            </Menu>
          </Stack>
        ) : showLoginBtn() ? (
          <Button sx={{boxShadow: 'none'}} onClick={goToLogin}>
            Login
          </Button>
        ) : null}
      </Toolbar>
    </AppBar>
  )
}

export default Header
