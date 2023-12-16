import OrderDetails from '@/features/order/order-details/OrderDetails'
import {requireAuth} from '@/server/auth/requireAuth'

export const getServerSideProps = requireAuth(async (ctx: any) => {
  return {props: {user: ctx.user ?? null}}
})

const ViewOrderPage: React.FC<{user: any}> = ({user}) => {
  return <OrderDetails readOnly />
}

export default ViewOrderPage
