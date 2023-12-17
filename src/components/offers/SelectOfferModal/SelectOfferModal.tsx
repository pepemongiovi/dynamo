import {Grid, Stack, Typography} from '@mui/material'
import {FC, useMemo} from 'react'
import Modal, {ModalProps} from '../../common/Modal'
import SelectInput from '../../common/SelectInput'
import {Control} from 'react-hook-form'
import useSelectOfferModal from './useSelectOfferModal'
import FormInput from '../../common/FormInput'
import {getPlaceholder} from '@/utils/format'
import {Offer, OfferDetails, Product, Variant} from '@prisma/client'
import Button from '../../common/Button'
import {getVariantLabel} from '@/features/order/order-details/useOrderDetails'
import {Add, CheckCircleOutlineSharp, Remove} from '@mui/icons-material'
import {OfferData} from '@/validation'

type NewVariantModalProps = Omit<ModalProps, 'children' | 'onSubmit'> & {
  offer?: OfferData
  products: Product[]
  editMode?: boolean
  onSubmit: (data: OfferData) => void
}

const SelectOfferModal: FC<NewVariantModalProps> = ({
  products,
  open,
  offer,
  editMode,
  onClose,
  onSubmit
}) => {
  const {
    control,
    offers,
    variants,
    selectedVariants,
    selectedVariant,
    offerProductAmounts,
    selectedOfferId,
    isOfferValid,
    handleClose,
    variantIncrementEnabled,
    onAddVariant,
    onRemoveVariant,
    submit
  } = useSelectOfferModal({
    onSubmit,
    products,
    offer,
    editMode,
    open,
    onClose
  })
  console.log('offer', offer)

  console.log('variants', variants)
  console.log('selectedVariants', selectedVariants)
  console.log('selectedOfferId', selectedOfferId)

  return (
    <Modal
      title="Adicionar Nova Oferta"
      btnLabel={offer ? 'Atualizar' : 'Adicionar'}
      open={open}
      onClose={handleClose}
      width={800}
      onSubmit={submit}
      disabled={!isOfferValid}
      btnSx={{bgcolor: 'success.main', '&:hover': {bgcolor: 'success.light'}}}
    >
      <form onSubmit={submit}>
        <Stack spacing={2}>
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
              options={offers.map((offer: Offer) => ({
                value: offer.id,
                label: offer.name
              }))}
            />
          )}

          {!!offers.length && !!selectedOfferId && (
            <Stack direction="row" spacing={2} alignItems="end">
              <SelectInput
                label="Variantes disponíveis"
                name="variantId"
                control={control}
                containerSx={{flex: 1}}
                disabled={!selectedVariant || isOfferValid}
                placeholder={getPlaceholder('variante', true, 'Selecione')}
                options={variants.map((variant: Variant) => ({
                  value: variant.id,
                  label: getVariantLabel(
                    variant,
                    (
                      products.find(
                        (p) => p.id === variant.productId
                      ) as Product
                    ).name
                  )
                }))}
              />
              <Button
                sx={{mb: '8.4px !important'}}
                disabled={!selectedVariant || isOfferValid}
                onClick={() => onAddVariant()}
              >
                Adicionar
              </Button>
            </Stack>
          )}

          <Grid container gap={2}>
            {offerProductAmounts.map(({product, selected, total}, idx) => (
              <Grid item key={idx}>
                <Stack spacing={0.8} direction="row" alignItems="center">
                  <CheckCircleOutlineSharp
                    sx={{
                      color: selected === total ? 'success.main' : 'disabled',
                      opacity: selected === total ? 1 : 0.5
                    }}
                  />
                  <Typography
                    sx={{
                      color: selected === total ? 'success.main' : 'placeholder'
                    }}
                  >
                    {selected} de {total} ({product.name})
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>

          <Stack spacing={1}>
            {selectedVariants.map(({id, amount, label}, idx) => {
              const incrementEnabled = variantIncrementEnabled(id)
              return (
                <Stack
                  key={idx}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Remove
                      onClick={() => onRemoveVariant(id, amount)}
                      sx={{
                        cursor: 'pointer',
                        width: 25,
                        color: 'danger.main'
                      }}
                    />
                    <Typography sx={{width: 20, textAlign: 'center'}}>
                      {amount}
                    </Typography>
                    <Add
                      onClick={() =>
                        incrementEnabled ? onAddVariant(id, amount) : null
                      }
                      sx={{
                        cursor: incrementEnabled ? 'pointer' : 'default',
                        width: 20,
                        color: incrementEnabled ? 'success.main' : 'disabled'
                      }}
                    />
                  </Stack>

                  <Typography>{label}</Typography>
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      </form>
    </Modal>
  )
}

export default SelectOfferModal
