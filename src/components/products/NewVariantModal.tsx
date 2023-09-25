import {Grid, Stack} from '@mui/material'
import {FC, useMemo} from 'react'
import Modal, {ModalProps} from '../common/Modal'
import SelectInput from '../common/SelectInput'
import {Control} from 'react-hook-form'
import useNewVariantModal from './useNewVariantModal'
import FormInput from '../common/FormInput'
import {getPlaceholder} from '@/utils/format'
import {Product} from '@prisma/client'
import {Variant} from '@/types/utils'

type NewVariantModalProps = Omit<ModalProps, 'children' | 'onSubmit'> & {
  products: Product[]
  variants: Variant[]
  onSubmit: (variant: Variant) => void
}

const NewVariantModal: FC<NewVariantModalProps> = ({
  products,
  open,
  onClose,
  onSubmit
}) => {
  const {control, offers, variants, submit} = useNewVariantModal({
    onSubmit,
    products
  })

  return (
    <Modal
      title="Adicionar Nova Variante"
      open={open}
      onClose={onClose}
      width={800}
      onSubmit={submit}
    >
      <form onSubmit={submit}>
        <Stack spacing={5}>
          {!!products.length && (
            <SelectInput
              label="Produto"
              name="productId"
              control={control}
              placeholder={getPlaceholder('produto', false, 'Selecione')}
              options={products.map((product) => ({
                value: product.id,
                label: product.name
              }))}
            />
          )}

          {!!offers.length && (
            <SelectInput
              label="Oferta"
              name="offerId"
              control={control}
              placeholder={getPlaceholder('oferta', true, 'Selecione')}
              options={offers.map((offer) => ({
                value: offer.id,
                label: offer.name
              }))}
            />
          )}

          {!!variants.length && (
            <SelectInput
              label="Oferta"
              name="offerId"
              control={control}
              placeholder={getPlaceholder('oferta', true, 'Selecione')}
              options={variants.map((offer) => ({
                value: offer.id,
                label: offer.name
              }))}
            />
          )}
        </Stack>
      </form>
    </Modal>
  )
}

export default NewVariantModal
