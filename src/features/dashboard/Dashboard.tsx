import Layout from '@/layouts/Layout'
import Login from '@/pages/app/login'
import {Stack} from '@mui/system'
import {FC} from 'react'
import Button from '@/components/common/Button'
import {Search} from '@mui/icons-material'
import FormInput from '@/components/common/FormInput'
import useDashboard from './useDashboard'
import OrdersTable from '@/components/common/OrdersTable'
import {useRouter} from 'next/router'
import {CircularProgress, Typography} from '@mui/material'

const Dashboard: FC = () => {
  const router = useRouter()
  const {control, orders, isLoading} = useDashboard()

  const goToOrderRegisterForm = () => router.push('/app/new-order')

  return (
    <Layout sx={{width: '100%'}} gap={4} align="start">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{width: '100%'}}
        spacing={2}
      >
        <FormInput
          name="filterByName"
          control={control}
          placeholder="Filtre pelo nome"
          startAdornment={<Search sx={{color: 'secondary.main', ml: 2}} />}
          containerSx={{width: 500}}
        />
        <Button sx={{width: 200}} onClick={goToOrderRegisterForm}>
          Novo pedido
        </Button>
      </Stack>

      {isLoading ? (
        <CircularProgress sx={{alignSelf: 'center', justifySelf: 'center'}} />
      ) : orders?.length ? (
        <OrdersTable rows={orders} />
      ) : (
        <Typography color="placeholder">Nenhum pedido realizado</Typography>
      )}
    </Layout>
  )
}

export default Dashboard
