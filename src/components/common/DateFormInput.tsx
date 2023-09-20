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
import {DatePicker} from '@mui/x-date-pickers/DatePicker'

type DateFormInputProps = InputProps & {
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
}

const DateFormInput: FC<DateFormInputProps> = ({
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
  error,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({field: {onChange, value, ref}, fieldState: {error}}) => (
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

            <DatePicker
              inputProps={{
                style: {
                  padding: '10px 20px',
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  borderRadius: 15,
                  ...(inputSx as CSSProperties)
                }
              }}
              format="dd/M/yyyy"
              slotProps={{textField: {size: 'small'}} as any}
              onChange={onChange}
              value={value}
              error={!!error}
              disableUnderline={true}
              disabled={disabled}
              endAdornment={endAdornment}
              sx={{
                border: '1px solid #62646e',
                boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
                borderRadius: 2.5,
                mt: 2,
                width: 1,
                bgcolor: 'white',
                ...sx
              }}
              {...props}
            />

            {error && (
              <FormHelperText sx={{color: 'error.main', height: 15}}>
                {error.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      )}
    />
  )
}

export default DateFormInput
