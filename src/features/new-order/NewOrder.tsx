import Layout from '@/layouts/Layout'
import {Stack} from '@mui/system'
import {FC, useMemo, useState} from 'react'
import FormInput from '@/components/common/FormInput'
import useNewOrder from './useNewOrder'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Typography
} from '@mui/material'
import SelectInput from '@/components/common/SelectInput'
import SelectOfferModal from '@/components/offers/SelectOfferModal'
import OrderSummary from '@/components/orders/order-summary/OrderSummary'
import {getPlaceholder} from '@/utils/format'
import DateFormInput from '@/components/common/DateFormInput'
import Button from '@/components/common/Button'
import {Add, Delete, Edit, ExpandMore} from '@mui/icons-material'
import OfferAccordion from '@/components/offers/OfferAccordion'

const NewOrder: FC = () => {
  const {
    control,
    shiftOpts,
    statesOpts,
    offers,
    products,
    newOfferModalOpened,
    editingOfferIdx,
    isLoading,
    isValid,
    setNewOfferModalOpened,
    handleNewOffer,
    handleRemoveOffer,
    onEditOffer,
    onSubmit
  } = useNewOrder()

  return (
    <Layout gap={5} direction="row">
      {/* <Divider orientation="vertical" flexItem /> */}

      <Stack spacing={0.5} width="100%" py={2}>
        <FormInput
          name="name"
          control={control}
          label="Nome completo"
          placeholder={getPlaceholder('nome completo')}
          rules={{required: 'Obrigatório'}}
        />

        <Grid container spacing={2} width="100%">
          <Grid item xs={4} sx={{pl: '0px !important'}}>
            <FormInput
              name="phone"
              type="number"
              control={control}
              label="Whatsapp"
              placeholder={getPlaceholder('telefone')}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>

          <Grid item xs={4}>
            <DateFormInput
              name="date"
              control={control}
              label="Data de Entrega"
              rules={{required: 'Obrigatório'}}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectInput
              name="shift"
              label="Turno"
              placeholder={getPlaceholder('turno', false, 'Selecione')}
              control={control}
              options={shiftOpts.map((shift) => ({
                value: shift,
                label: shift
              }))}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>
        </Grid>

        <Divider flexItem sx={{pt: 2}} />

        <Grid container spacing={2} width="100%">
          <Grid item xs={4} sx={{pl: '0px !important'}}>
            <FormInput
              name="addressInfo.zipcode"
              control={control}
              label="CEP"
              placeholder={getPlaceholder('CEP')}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>

          <Grid item xs={4}>
            <SelectInput
              label="Estado"
              name="addressInfo.state"
              placeholder={getPlaceholder('estado', false, 'Selecione')}
              control={control}
              options={statesOpts.map((state) => ({
                value: state.shortName,
                label: state.name
              }))}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              name="addressInfo.city"
              control={control}
              label="Cidade"
              placeholder={getPlaceholder('cidade', true)}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} width="100%">
          <Grid item xs={8} sx={{pl: '0px !important'}}>
            <FormInput
              name="addressInfo.address"
              control={control}
              label="Endereço"
              placeholder={getPlaceholder('endereço')}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              name="addressInfo.number"
              type="number"
              control={control}
              label="Número"
              placeholder={getPlaceholder('número')}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} width="100%">
          <Grid item xs={4} sx={{pl: '0px !important'}}>
            <FormInput
              name="addressInfo.district"
              control={control}
              label="Bairro"
              placeholder={getPlaceholder('bairro')}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>

          <Grid item xs={8}>
            <FormInput
              name="addressInfo.complement"
              control={control}
              label="Complemento"
              placeholder={getPlaceholder('complemento')}
            />
          </Grid>
        </Grid>

        <Divider flexItem sx={{pb: 2}} />

        <FormInput
          containerSx={{pt: 2}}
          name="observations"
          control={control}
          label="Observações"
          placeholder="Digite as observações"
        />

        <Divider flexItem sx={{pt: 2}} />

        <Stack direction="row" justifyContent="space-between" py={2}>
          <Typography fontSize={20} pt={1}>
            Ofertas escolhidas
          </Typography>

          <Button
            size="sm"
            startIcon={<Add />}
            onClick={() => setNewOfferModalOpened(true)}
          >
            Adicionar Oferta
          </Button>
        </Stack>

        <Stack spacing={1.5}>
          {!offers.length ? (
            <Typography color="placeholder">
              Nenhuma oferta escolhida
            </Typography>
          ) : (
            offers.map((offer, idx) => (
              <OfferAccordion
                offer={offer}
                onEdit={onEditOffer}
                onRemove={handleRemoveOffer}
                idx={idx}
              />
            ))
          )}
        </Stack>

        <SelectOfferModal
          offer={editingOfferIdx !== null ? offers[editingOfferIdx] : undefined}
          open={newOfferModalOpened}
          onClose={() => setNewOfferModalOpened(false)}
          onSubmit={handleNewOffer}
          products={products}
        />
      </Stack>

      <OrderSummary
        onSubmit={onSubmit}
        isLoading={isLoading}
        offers={offers}
        isValid={isValid}
      />
    </Layout>
  )
}

export default NewOrder
