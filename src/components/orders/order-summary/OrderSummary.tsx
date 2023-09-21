import {Box, Stack, Typography} from '@mui/material'
import React from 'react'
import Tile from '../../common/Tile'
import useOrderSummary from './useOrderSummary'
import Button from '@/components/common/Button'

const OrderSummary = () => {
  const {onSubmit} = useOrderSummary()

  return (
    <Tile sx={{width: '40%', minWidth: 250, height: '100%', pb: 3, pt: 1.5}}>
      <Stack sx={{flex: 1, minHeight: 500}}>
        <Typography fontSize={32}>Agendar pedido</Typography>
      </Stack>
      <Button sx={{mt: 4}} onClick={onSubmit}>
        Agendar Pedido
      </Button>
    </Tile>
  )
}

export default OrderSummary
