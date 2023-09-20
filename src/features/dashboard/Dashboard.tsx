import Layout from '@/layouts/Layout'
import Login from '@/pages/app/login'
import {Stack} from '@mui/system'
import {FC} from 'react'
import Button from '@/components/common/Button'
import {Search} from '@mui/icons-material'
import FormInput from '@/components/common/FormInput'
import useDashboard from './useDashboard'
import Table from '@/components/common/Table'
import {useRouter} from 'next/router'

const Dashboard: FC = () => {
  const router = useRouter()
  const {control} = useDashboard()

  const goToOrderRegisterForm = () => router.push('/app/new-order')

  return (
    <Layout sx={{width: '100%'}} gap={4}>
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

      <Table />
    </Layout>
  )
}

export default Dashboard
