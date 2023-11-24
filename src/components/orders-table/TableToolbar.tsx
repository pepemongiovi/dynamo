import {BlockOutlined} from '@mui/icons-material'
import {IconButton, Toolbar, Tooltip, Typography, alpha} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'

interface TableToolbarProps {
  numSelected: number
}

function TableToolbar(props: TableToolbarProps) {
  const {numSelected} = props

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
      {numSelected > 0 ? (
        <Tooltip title={`Cancelar pedido${numSelected > 1 ? 's' : ''}`}>
          <BlockOutlined sx={{mr: 1, cursor: 'pointer'}} color="error" />
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default TableToolbar
