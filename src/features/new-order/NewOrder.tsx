import Layout from '@/layouts/Layout'
import Login from '@/pages/app/login'
import {Stack} from '@mui/system'
import {FC, useMemo, useState} from 'react'
import FormInput from '@/components/common/FormInput'
import useNewOrder from './useNewOrder'
import {Box, Divider, Grid, Typography} from '@mui/material'
import SelectInput from '@/components/common/SelectInput'
import TagSelector from '@/components/common/TagSelector'
import Modal from '@/components/common/Modal'
import Tile from '@/components/common/Tile'
import SelectOfferModal from '@/components/offers/SelectOfferModal'
import OrderSummary from '@/components/orders/order-summary/OrderSummary'
import {getPlaceholder} from '@/utils/format'
import DateFormInput from '@/components/common/DateFormInput'

const NewOrder: FC = () => {
  const {
    control,
    shiftOpts,
    statesOpts,
    offers,
    products,
    newOfferModalOpened,
    setNewOfferModalOpened,
    handleNewOffer,
    handleRemoveOffer,
    onSubmit
  } = useNewOrder()

  const offersTags = useMemo(() => offers.map((offer) => offer), [offers])
  console.log(offers)
  return (
    <Layout gap={5} direction="row">
      <OrderSummary />

      {/* <Divider orientation="vertical" flexItem /> */}

      <Stack spacing={2} width="100%" py={2}>
        <FormInput
          name="name"
          control={control}
          label="Nome completo"
          placeholder={getPlaceholder('nome completo')}
        />

        <Grid container spacing={2} width="100%">
          <Grid item xs={4} sx={{pl: '0px !important'}}>
            <FormInput
              name="phone"
              control={control}
              label="Whatsapp"
              placeholder={getPlaceholder('número de telefone')}
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
            />
          </Grid>
          <Grid item xs={4}>
            <DateFormInput
              name="date"
              control={control}
              label="Data de Entrega"
            />
          </Grid>
        </Grid>

        <Divider flexItem sx={{pt: 2}} />

        <Grid container spacing={2} width="100%">
          <Grid item xs={4} sx={{pl: '0px !important'}}>
            <FormInput
              name="zipcode"
              control={control}
              label="CEP"
              placeholder={getPlaceholder('CEP')}
            />
          </Grid>

          <Grid item xs={4}>
            <SelectInput
              label="Estado"
              name="state"
              placeholder={getPlaceholder('estado', false, 'Selecione')}
              control={control}
              options={statesOpts.map((state) => ({
                value: state.shortName,
                label: state.name
              }))}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              name="city"
              control={control}
              label="Cidade"
              placeholder={getPlaceholder('cidade', true)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} width="100%">
          <Grid item xs={8} sx={{pl: '0px !important'}}>
            <FormInput
              name="address"
              control={control}
              label="Endereço"
              placeholder={getPlaceholder('endereço')}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              name="number"
              control={control}
              label="Número"
              placeholder={getPlaceholder('número')}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} width="100%">
          <Grid item xs={4} sx={{pl: '0px !important'}}>
            <FormInput
              name="district"
              control={control}
              label="Bairro"
              placeholder={getPlaceholder('bairro')}
            />
          </Grid>

          <Grid item xs={8}>
            <FormInput
              name="complement"
              control={control}
              label="Complemento"
              placeholder={getPlaceholder('complemento')}
            />
          </Grid>
        </Grid>

        <Divider flexItem sx={{pt: 2}} />

        <Typography fontSize={20} pt={1}>
          Variantes
        </Typography>

        <TagSelector
          addBtnLabel="Nova Variante"
          openModal={() => setNewOfferModalOpened(true)}
          onRemove={handleRemoveOffer}
          tags={offers.map((offer) => offer.name)}
        />
        <SelectOfferModal
          open={newOfferModalOpened}
          onClose={() => setNewOfferModalOpened(false)}
          onSubmit={handleNewOffer}
          products={products}
        />
      </Stack>
    </Layout>
  )
}

export default NewOrder
