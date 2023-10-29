import {CSSProperties, FC} from 'react'
import {Control, Controller, RegisterOptions} from 'react-hook-form'
import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  InputProps,
  SxProps
} from '@mui/material'
import {getPlaceholder} from '@/utils/format'
import InputMask from 'react-input-mask'

type FormInputProps = InputProps & {
  control: Control<any>
  name: string
  rules?: RegisterOptions
  sx?: SxProps
  defaultValue?: string
  disabled?: boolean
  label?: string
  containerSx?: SxProps
  inputSx?: SxProps
  error?: string
  endAdornment?: any
  inputMask?: string
}

const FormInput: FC<FormInputProps> = ({
  control,
  name,
  rules,
  sx = {},
  defaultValue,
  endAdornment,
  disabled,
  label,
  containerSx,
  inputSx,
  error: customError,
  inputMask,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({
        field: {onChange, value, ref},
        fieldState: {error: formError}
      }) => {
        const error = customError || formError?.message?.toString()

        const renderInput = () => (
          <Input
            ref={ref}
            inputProps={{
              style: {
                padding: '10px 20px',
                WebkitBoxShadow: '0 0 0 1000px white inset',
                borderRadius: 15,
                ...(inputSx as CSSProperties)
              }
            }}
            onChange={onChange}
            value={value}
            error={!!error}
            disableUnderline={true}
            disabled={disabled}
            endAdornment={endAdornment}
            sx={{
              border: `1px solid ${disabled ? 'rgba(0,0,0,0.35)' : 'black'}`,
              boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
              borderRadius: 2.5,
              pr: 1.5,
              width: 1,
              bgcolor: 'white',
              ...sx
            }}
            {...props}
          />
        )

        return (
          <Box sx={{flex: 1, ...containerSx}}>
            <FormControl
              sx={{
                width: 1,
                my: 1,
                '& .MuiFormHelperText-root': {ml: '1px'}
              }}
            >
              {label && (
                <InputLabel
                  shrink
                  sx={{
                    color: disabled ? 'disabled.main' : 'black',
                    fontSize: 23,
                    ml: -2,
                    mt: -1
                  }}
                >
                  {label}
                </InputLabel>
              )}

              {inputMask ? (
                <InputMask
                  mask={inputMask}
                  value={value}
                  onChange={onChange}
                  disabled={disabled}
                >
                  {() => renderInput()}
                </InputMask>
              ) : (
                renderInput()
              )}

              {error && (
                <FormHelperText sx={{color: 'error.main', height: 15}}>
                  {error}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
        )
      }}
    />
  )
}

export default FormInput
