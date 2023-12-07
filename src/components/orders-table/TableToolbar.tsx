import {BlockOutlined, EditNote} from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import {useRouter} from 'next/router'

interface TableToolbarProps {
  selectedOrderIds: string[]
  isUpdatingOrders: boolean
  handleCancelOrders: (orderIds?: string[]) => void
}

function TableToolbar({
  selectedOrderIds,
  isUpdatingOrders,
  handleCancelOrders
}: TableToolbarProps) {
  const router = useRouter()
  const numSelected = selectedOrderIds.length

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            )
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{flex: '1 1 100%'}}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {`${numSelected} ${
            numSelected <= 1 ? 'pedido selecionado' : 'pedidos selecionados'
          }`}
        </Typography>
      ) : (
        <Typography
          sx={{flex: '1 1 100%'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Pedidos realizados
        </Typography>
      )}
      {numSelected > 0 && (
        <Stack direction="row" spacing={1} mr={1}>
          <Stack
            direction="row"
            spacing={1}
            onClick={() => router.push(`/app/orders/${selectedOrderIds[0]}`)}
            sx={{mr: 1, cursor: isUpdatingOrders ? 'default' : 'pointer'}}
          >
            {numSelected === 1 && (
              <>
                <EditNote />
                <Typography whiteSpace="nowrap" pr={2}>
                  Editar pedido
                </Typography>
              </>
            )}
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            onClick={() => (isUpdatingOrders ? {} : handleCancelOrders())}
            sx={{mr: 1, cursor: isUpdatingOrders ? 'default' : 'pointer'}}
          >
            {isUpdatingOrders ? (
              <CircularProgress size={24} color="error" />
            ) : (
              <BlockOutlined color="error" />
            )}
            <Typography color="danger.dark" whiteSpace="nowrap">
              {'Cancelar pedido(s)'}
            </Typography>
          </Stack>
        </Stack>
      )}
      {/* <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip> */}
    </Toolbar>
  )
}

export default TableToolbar
