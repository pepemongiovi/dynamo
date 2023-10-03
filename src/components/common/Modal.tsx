import * as React from 'react'
import {
  Modal as MuiModal,
  Typography,
  Box,
  ModalProps as MuiModalProps,
  Stack,
  SxProps
} from '@mui/material'
import {Close} from '@mui/icons-material'
import Button from './Button'

export type ModalProps = MuiModalProps & {
  title?: string
  disabled?: boolean
  open: boolean
  width?: number
  btnLabel?: string
  btnSx?: SxProps
  children: React.ReactNode
  onClose: () => void
  onSubmit?: () => void
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  width,
  btnLabel,
  disabled,
  btnSx,
  onSubmit,
  onClose,
  ...props
}) => {
  const rootRef = React.useRef<HTMLDivElement>(null)

  const handleClose = () => {
    onClose()
  }

  return (
    <MuiModal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      onClose={handleClose}
      aria-labelledby="server-modal-title"
      aria-describedby="server-modal-description"
      sx={{
        display: 'flex',
        p: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      container={() => rootRef.current}
      {...props}
    >
      <form onSubmit={onSubmit}>
        <Stack
          sx={{
            position: 'relative',
            width,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: (theme) => theme.shadows[5]
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{borderBottom: '1px solid black', p: 2}}
          >
            <Typography fontSize={22}>{title}</Typography>
            <Close sx={{cursor: 'pointer'}} onClick={handleClose} />
          </Stack>
          <Stack sx={{p: 3}}>{children}</Stack>

          <Stack direction="row" p={3} pt={1} spacing={2} justifyContent="end">
            <Button onClick={handleClose} danger>
              Cancelar
            </Button>
            {onSubmit && (
              <Button type="submit" disabled={disabled} sx={btnSx}>
                {btnLabel || 'Confirmar'}
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
    </MuiModal>
  )
}

export default Modal
