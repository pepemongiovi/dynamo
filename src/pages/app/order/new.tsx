import OrderDetails from '@/features/order/order-details/OrderDetails'
import {requireAuth} from '@/server/auth/requireAuth'

export const getServerSideProps = requireAuth(async (ctx: any) => {
  return {props: {user: ctx.user ?? null}}
})

const NewOrderPage: React.FC<{user: any}> = ({user}) => {
  return <OrderDetails />
}

export default NewOrderPage
