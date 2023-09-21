import {FC} from 'react'
import {Control} from 'react-hook-form'
import FormInput from './FormInput'
import {InputProps} from '@mui/material'
import {getPlaceholder} from '@/utils/format'

type EmailFormInputProps = InputProps & {
  control: Control<any>
  name?: string
  label?: string
}

const EmailFormInput: FC<EmailFormInputProps> = ({control, name, label}) => {
  const isEmailValid = (email: string) =>
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
      ? true
      : 'Invalid email'

  return (
    <FormInput
      label={label || 'Email'}
      name={name || 'email'}
      type="email"
      placeholder="Digite seu email..."
      control={control}
      rules={{
        validate: (value) => {
          if (!value) return 'Email required'
          return isEmailValid(value as string)
        }
      }}
    />
  )
}

export default EmailFormInput
