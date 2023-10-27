import {Badge, Box, Card, Divider, Stack, Typography} from '@mui/material'
import React, {ReactNode, useMemo} from 'react'
import Tile from '../../common/Tile'
import useOrderSummary from './useOrderSummary'
import Button from '@/components/common/Button'
import {formatMoney} from '@/utils/format'
import {OfferData} from '@/validation'
import NumericCircle from '@/components/common/NumericCircle'

const CardContainer = ({children}: {children: ReactNode}) => (
  <Card
    sx={{
      height: '100%',
      p: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 2.5
    }}
  >
    {children}
  </Card>
)

const CardRow = ({
  hideDivider,
  label,
  fontSize,
  value,
  amount
}: {
  hideDivider?: boolean
  fontSize?: number
  label: string
  value: string
  amount?: number
}) => (
  <Stack spacing={2} width="100%">
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={4}
    >
      {amount ? (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="start"
        >
          <NumericCircle amount={amount} />
          <Typography fontSize={fontSize || 14}>{label}</Typography>
        </Stack>
      ) : (
        <Typography fontSize={fontSize || 14}>{label}</Typography>
      )}

      <Typography whiteSpace="nowrap" fontSize={fontSize}>
        {value}
      </Typography>
    </Stack>
    {!hideDivider && <Divider sx={{width: '100%'}} />}
  </Stack>
)

const OrderSummary = ({
  onSubmit,
  isLoading,
  isValid,
  offers
}: {
  offers: OfferData[]
  isLoading: boolean
  isValid: boolean
  onSubmit: () => void
}) => {
  console.log(999, offers)
  const {handleSubmit} = useOrderSummary()

  const getOffersTotalPrice = (offers: OfferData[]) =>
    offers.reduce(
      (total, offer) =>
        total +
        offer.variantsInfo.reduce(
          (total, variant) => (variant.price || 1) * variant.amount + total,
          0
        ),
      0
    )

  const stackedOffers = useMemo(() => {
    return offers.reduce(
      (result, offer: OfferData) => {
        const id = offer.offerId
        const offerExists = result[id] as any
        if (offerExists) {
          return {...result, [id]: [...offerExists, offer]}
        }
        return {...result, [id]: [offer]}
      },
      {} as Record<string, OfferData[]>
    )
  }, [offers])

  const totalPrice = useMemo(
    () =>
      Object.values(stackedOffers).reduce(
        (total: number, offers: OfferData[]) =>
          getOffersTotalPrice(offers) + total,
        0
      ),
    [stackedOffers]
  )

  const renderOffers = () =>
    Object.values(stackedOffers).map(
      (offers, idx) => (
        <CardRow
          amount={offers.length}
          label={offers[0]?.name ?? ''}
          value={formatMoney(getOffersTotalPrice(offers))}
          hideDivider={Object.keys(stackedOffers).length - 1 <= idx}
        />
      ),
      [] as any
    )

  return (
    <Tile
      sx={{
        width: '40%',
        minWidth: 250,
        height: '100%',
        pb: 3,
        pt: 1.5,
        bgcolor: 'white',
        boxShadow: '5px 5px 8px 3px #474787'
      }}
    >
      <Stack sx={{flex: 1}} spacing={2} mb={2}>
        <Typography fontSize={24}>Resumo do pedido</Typography>

        <CardContainer>
          {!offers.length && (
            <Typography color="placeholder" sx={{alignSelf: 'start'}}>
              Nenhuma oferta adicionada
            </Typography>
          )}
          {renderOffers()}
        </CardContainer>
      </Stack>
      <Stack width="100%">
        <CardContainer>
          <CardRow
            label="Total"
            value={formatMoney(totalPrice)}
            fontSize={20}
            hideDivider
          />
        </CardContainer>
        <Button
          sx={{mt: 4}}
          onClick={onSubmit}
          disabled={!offers.length || !isValid}
          loading={isLoading}
        >
          Agendar Pedido
        </Button>
      </Stack>
    </Tile>
  )
}

export default OrderSummary
