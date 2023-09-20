import {FC} from 'react'
import {useRouter} from 'next/router'
import {Stack, Typography} from '@mui/material'
import useLoginForm from './useLoginForm'
import EmailFormInput from '@/components/common/EmailFormInput'
import Layout from '@/layouts/Layout'
import Tile from '@/components/common/Tile'
import PasswordFormInput from '@/components/common/PasswordFormInput'
import Button from '@/components/common/Button'

const Login: FC = () => {
  const router = useRouter()
  const {control, onSubmit, isLoading} = useLoginForm()

  return (
    <Layout justify="center" align="center">
      <Tile sx={{width: 400, paddingBottom: 10, py: 8, px: 4}} gap={6}>
        <Typography fontSize={30} align="center" sx={{color: 'primary'}}>
          Entre no Dynamo
        </Typography>
        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <EmailFormInput control={control} />
            <PasswordFormInput control={control} />
            <Button loading={isLoading} type="submit">
              Entrar
            </Button>
          </Stack>
        </form>
      </Tile>
    </Layout>
  )
}

export default Login
