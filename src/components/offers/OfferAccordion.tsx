import {OfferData} from '@/validation'
import {ExpandMore} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography
} from '@mui/material'
import Button from '../common/Button'
import NumericCircle from '../common/NumericCircle'

const OfferAccordion = ({
  offer,
  onEdit,
  onRemove,
  idx
}: {
  offer: OfferData
  onEdit: (idx: number) => void
  onRemove: (idx: number) => void
  idx: number
}) => {
  return (
    <Stack direction="row" spacing={1} alignItems="start">
      <Accordion sx={{width: '100%', padding: 1, bgcolor: 'white'}}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            minHeight: '20px !important',
            height: '50px !important'
          }}
        >
          <Typography>{offer.name}</Typography>
        </AccordionSummary>
        <Divider sx={{}} />
        <AccordionDetails>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Stack spacing={0.5}>
              {offer.variantsInfo.map(({name, amount}) => (
                <Typography
                  fontSize={15}
                  color="placeholder"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.7
                  }}
                >
                  <NumericCircle
                    bgcolor="background.paper"
                    textColor="primary.main"
                    amount={amount}
                  />
                  {name}
                </Typography>
              ))}
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="start"
              spacing={1}
            >
              <Button size="xs" variant="outlined" onClick={() => onEdit(idx)}>
                Editar
              </Button>
              <Button size="xs" danger onClick={() => onRemove(idx)}>
                Excluir
              </Button>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  )
}

export default OfferAccordion
