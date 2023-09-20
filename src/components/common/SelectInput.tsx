import {Info, InfoOutlined} from '@mui/icons-material'
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  SxProps,
  Tooltip,
  Typography
} from '@mui/material'
import {FC} from 'react'
import {Control, Controller, RegisterOptions} from 'react-hook-form'

type SelectInputProps = SelectProps & {
  name: string
  options: {value: any; label: string}[]
  label?: string
  labelInfo?: string
  placeholder?: string
  rules?: RegisterOptions
  sx?: SxProps
  inputSx?: SxProps
  containerSx?: SxProps
  control: Control<any>
  hideError?: boolean
  noLabel?: boolean
}

const SelectInput: FC<SelectInputProps> = ({
  label,
  labelInfo,
  placeholder,
  name,
  rules,
  options,
  sx,
  inputSx,
  containerSx,
  control,
  hideError,
  noLabel,
  ...props
}) => {
  const inputStyle = {
    color: 'black',
    bgcolor: 'white',
    boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
    borderRadius: 2.5,
    width: 1,
    pr: 1
  }
  const showLabel = !noLabel && label
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, value, ref}, fieldState: {error}}) => (
        <Box sx={{mb: 1, ...containerSx}}>
          <FormControl
            sx={{
              width: 1,
              my: 1.05,
              '& .MuiFormHelperText-root': {ml: '1px'}
            }}
          >
            {showLabel && (
              <InputLabel
                shrink
                sx={{
                  color: props.disabled ? 'disabled.main' : 'black',
                  fontSize: 23,
                  ml: -1.5,
                  mt: -1
                }}
              >
                {label}
                {labelInfo && (
                  <Tooltip title={labelInfo}>
                    <InfoOutlined
                      sx={{ml: 1, mb: 0.3, width: 19, height: 19}}
                    />
                  </Tooltip>
                )}
              </InputLabel>
            )}

            <Select
              inputProps={{
                sx: {
                  py: '10px',
                  ...inputStyle,
                  ...inputSx
                },
                MenuProps: {
                  PaperProps: {sx: {maxHeight: 250}},
                  MenuListProps: {sx: {...inputStyle, borderRadius: 0}}
                },
                ...props.inputProps
              }}
              value={value}
              sx={{
                mt: showLabel ? 2 : 0,
                borderRadius: '10px',
                border: '0.5px solid black',
                '& .Mui-disabled': {WebkitTextFillColor: '#71797E !important'},
                '& legend': {display: 'none'},
                '& fieldset': {top: 0},
                mb: -2,
                ...sx
              }}
              displayEmpty
              renderValue={
                value
                  ? undefined
                  : () => (
                      <Typography sx={{color: 'text.disabled'}}>
                        {placeholder}
                      </Typography>
                    )
              }
              onChange={onChange}
              error={!!error}
              {...props}
            >
              {options.map((option, idx) => (
                <MenuItem key={idx} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {!hideError && error && (
              <FormHelperText sx={{color: 'error.main', height: 15}}>
                {error?.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      )}
    />
  )
}

export default SelectInput
