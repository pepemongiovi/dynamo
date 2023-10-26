import {Stack, Typography} from '@mui/material'

const NumericCircle = ({
  amount,
  bgcolor = 'secondary.main',
  textColor = 'white'
}: {
  amount: number
  bgcolor?: string
  textColor?: string
}) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      alignItems="center"
      sx={{
        minWidth: 18,
        minHeight: 18,
        borderRadius: '50%',
        border: '1px solid #2C2C54',
        bgcolor
      }}
    >
      <Typography sx={{color: textColor, fontSize: 12}}>{amount}</Typography>
    </Stack>
  )
}

export default NumericCircle
