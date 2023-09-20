import {FC} from 'react'
import {NextRouter, useRouter} from 'next/router'
import {Stack, Typography} from '@mui/material'
import useSignUpForm from './useSignUpForm'
import Layout from '@/layouts/Layout'

const SignUpForm: FC = () => {
  const router = useRouter()
  const {control} = useSignUpForm()

  return (
    <Layout sx={{bgcolor: 'white'}}>
      <Stack
        sx={{
          maxWidth: '1132px',
          mx: 'auto',
          pb: 10,
          mt: '84px',
          px: '10px',
          width: '100%',
          minHeight: '70vh'
        }}
      ></Stack>
    </Layout>
  )
}

export default SignUpForm
