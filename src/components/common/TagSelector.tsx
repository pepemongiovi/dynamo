import {Box, Stack} from '@mui/material'
import Tag from './Tag'
import {Add} from '@mui/icons-material'
import {FC} from 'react'

type TagSelectorProps = {
  addBtnLabel: string
  openModal: () => void
  onRemove: (tag: string) => void
  tags: string[]
}

const TagSelector: FC<TagSelectorProps> = ({
  addBtnLabel,
  tags,
  onRemove,
  openModal
}) => {
  return (
    <Box sx={{display: 'inline-flex', gap: 2}}>
      <Tag label={addBtnLabel} onClick={openModal} icon={<Add />} />
      {tags.map((tag) => (
        <Tag label={tag} onClick={() => onRemove(tag)} isDeletable filled />
      ))}
    </Box>
  )
}

export default TagSelector
