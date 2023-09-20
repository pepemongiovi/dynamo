import {Box, InputProps, Stack} from '@mui/material'
import {FC, useState} from 'react'
import FormInput from './FormInput'
import {Control} from 'react-hook-form'
import {Visibility, VisibilityOff} from '@mui/icons-material'

type PasswordFormInputProps = InputProps & {
  name?: string
  label?: string
  control: Control<any>
}

const PasswordFormInput: FC<PasswordFormInputProps> = ({
  name,
  label,
  control
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword((e) => !e)
  }

  const isPasswordValid = (email: string) =>
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/g.test(email)
      ? true
      : 'Senha deve ter pelo menos 8 caracteres contendo pelo menos uma letras maiúscula, minúscula, número e caractere especial.'

  return (
    <FormInput
      label={label || 'Password'}
      name={name || 'password'}
      type={showPassword ? 'text' : 'password'}
      control={control}
      endAdornment={
        <Stack
          alignItems="center"
          sx={{cursor: 'pointer'}}
          onClick={toggleShowPassword}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </Stack>
      }
      rules={{
        validate: (value) => {
          if (!value || value === '') return 'Password required'
          return isPasswordValid(value as string)
        }
      }}
    />
  )
}

export default PasswordFormInput
