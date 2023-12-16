import OrderDetails from '@/features/order/order-details/OrderDetails'
import {requireAuth} from '@/server/auth/requireAuth'

export const getServerSideProps = requireAuth(async (ctx: any) => {
  return {props: {user: ctx.user ?? null}}
})

const EditOrderPage: React.FC<{user: any}> = ({user}) => {
  return <OrderDetails editMode />
}

export default EditOrderPage
