import {Card, CardProps, Stack} from '@mui/material'
import {FC, ReactNode} from 'react'

type TileProps = {
  children: ReactNode
  align?: 'center' | 'space-between'
  justify?: 'center' | 'space-between'
  direction?: 'row' | 'column'
  gap?: number
} & CardProps

const Tile: FC<TileProps> = ({children, sx, align, justify, gap, ...props}) => (
  <Card
    sx={{border: '1px solid black', borderRadius: 2.5, p: '10px 20px', ...sx}}
    {...props}
  >
    <Stack alignItems={align} justifyContent={justify} spacing={gap}>
      {children}
    </Stack>
  </Card>
)

export default Tile
