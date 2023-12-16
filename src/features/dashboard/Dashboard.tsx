import Layout from '@/layouts/Layout'
import {Stack} from '@mui/system'
import {FC} from 'react'
import Button from '@/components/common/Button'
import {Search} from '@mui/icons-material'
import FormInput from '@/components/common/FormInput'
import {useRouter} from 'next/router'
import OrdersTable from '@/components/orders-table/OrdersTable'
import useDashboard from './useDashboard'

const Dashboard: FC = () => {
  const router = useRouter()
  const {control, userId} = useDashboard()

  const goToOrderRegisterForm = () => router.push('/app/order/new')

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

      <OrdersTable userId={userId} />
    </Layout>
  )
}

export default Dashboard
