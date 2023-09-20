import {Close} from '@mui/icons-material'
import {Box, Stack, SxProps, Typography} from '@mui/material'
import {FC, ReactNode} from 'react'
import {boolean} from 'zod'

type TagProps = {
  sx?: SxProps
  filled?: boolean
  label: string
  icon?: ReactNode
  endIcon?: ReactNode
  isDeletable?: boolean
  onClick?: () => void
}

const Tag: FC<TagProps> = ({
  label,
  icon,
  endIcon,
  isDeletable,
  onClick,
  sx,
  filled
}) => {
  return (
    <Stack
      py={1}
      px={2.5}
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        borderRadius: 5,
        bgcolor: filled ? 'primary.main' : 'white',
        width: 'min-content',
        cursor: onClick ? 'pointer' : 'default',
        border: '0.5px solid black',
        ...sx
      }}
      onClick={onClick}
    >
      {icon}
      <Typography sx={{color: filled ? 'white' : 'black'}} whiteSpace="nowrap">
        {label}
      </Typography>
      {isDeletable && <Close sx={{color: 'white'}} />}
      {endIcon}
    </Stack>
  )
}

export default Tag
