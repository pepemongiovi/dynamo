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
  onSubmit: (variant: Variant) => void
}

const NewVariantModal: FC<NewVariantModalProps> = ({
  products,
  open,
  onClose,
  onSubmit
}) => {
  const {control, selectedOfferId, selectedProductId, submit} =
    useNewVariantModal({
      onSubmit
    })

  const selectedProduct = useMemo(
    () => products.find((product: Product) => product.id === selectedProductId),
    [selectedProductId]
  )

  return (
    <Modal
      title="Adicionar Nova Variante"
      open={open}
      onClose={onClose}
      width={800}
      onSubmit={submit}
    >
      <form onSubmit={submit}>
        <Stack spacing={0.5}>
          <Grid container spacing={2} width="100%">
            <Grid
              item
              xs={selectedProduct ? 6 : 12}
              sx={{pl: '0px !important'}}
            >
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
            </Grid>
            {selectedProduct && (
              <Grid item xs={6} sx={{pl: '16px !important'}}>
                <SelectInput
                  label="Oferta"
                  name="offerId"
                  control={control}
                  placeholder={getPlaceholder('oferta', true, 'Selecione')}
                  options={
                    selectedProduct?.offers?.map((offer) => ({
                      value: offer.id,
                      label: offer.name
                    })) || []
                  }
                />
              </Grid>
            )}
          </Grid>

          {selectedOfferId && (
            <Grid container spacing={2} width="100%">
              <Grid item xs={6} sx={{pl: '0px !important'}}>
                <FormInput
                  name="size"
                  control={control}
                  label="Tamanho"
                  placeholder={getPlaceholder('tamanho')}
                />
              </Grid>
              <Grid item xs={6}>
                <FormInput
                  name="color"
                  control={control}
                  label="Cor"
                  placeholder={getPlaceholder('cor')}
                />
              </Grid>
            </Grid>
          )}
        </Stack>
      </form>
    </Modal>
  )
}

export default NewVariantModal
