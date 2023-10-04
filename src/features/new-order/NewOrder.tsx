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

const NewOrder: FC = () => {
  const {
    control,
    shiftOpts,
    statesOpts,
    offers,
    products,
    newOfferModalOpened,
    editingOfferIdx,
    setNewOfferModalOpened,
    handleNewOffer,
    handleRemoveOffer,
    onEditOffer,
    onSubmit
  } = useNewOrder()

  return (
    <Layout gap={5} direction="row">
      <OrderSummary onSubmit={onSubmit} />

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
              control={control}
              label="Whatsapp"
              placeholder={getPlaceholder('número de telefone')}
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
          <Grid item xs={4}>
            <DateFormInput
              name="date"
              control={control}
              label="Data de Entrega"
              rules={{required: 'Obrigatório'}}
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
              rules={{required: 'Obrigatório'}}
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
              rules={{required: 'Obrigatório'}}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              name="city"
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
              name="address"
              control={control}
              label="Endereço"
              placeholder={getPlaceholder('endereço')}
              rules={{required: 'Obrigatório'}}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput
              name="number"
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
              name="district"
              control={control}
              label="Bairro"
              placeholder={getPlaceholder('bairro')}
              rules={{required: 'Obrigatório'}}
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

        <Stack direction="row" justifyContent="space-between" pb={2}>
          <Typography fontSize={20} pt={1}>
            Ofertas escolhidas
          </Typography>

          <Button
            startIcon={<Add />}
            onClick={() => setNewOfferModalOpened(true)}
          >
            Adicionar Oferta
          </Button>
        </Stack>

        {!offers.length ? (
          <Typography color="placeholder">Nenhuma oferta escolhida</Typography>
        ) : (
          offers.map((offer, idx) => (
            <Stack direction="row" spacing={1} alignItems="start">
              <Accordion sx={{width: '100%', padding: 1}}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{minHeight: '20px !important', height: '50px !important'}}
                >
                  <Typography>{offer.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="end"
                  >
                    <Stack spacing={0.5}>
                      {offer.variantsInfo.map(({name, amount}) => (
                        <Typography
                          fontSize={15}
                          color="placeholder"
                          sx={{display: 'flex', alignItems: 'center', gap: 0.7}}
                        >
                          <Typography color="grey.main">
                            ◦ ({amount})
                          </Typography>{' '}
                          {name}
                        </Typography>
                      ))}
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="end"
                      spacing={1}
                    >
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => onEditOffer(idx)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        danger
                        onClick={() => handleRemoveOffer(idx)}
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          ))
        )}

        <SelectOfferModal
          offer={editingOfferIdx !== null ? offers[editingOfferIdx] : undefined}
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
