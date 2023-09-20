import NewOrder from '@/features/new-order/NewOrder'
import {LoginCredentials, requireAuth} from '@/server/auth/requireAuth'

export const getServerSideProps = requireAuth(async (ctx: any) => {
  return {props: {user: ctx.user ?? null}}
})

const NewOrderPage: React.FC<{user: LoginCredentials | null}> = ({user}) => {
  return <NewOrder />
}

export default NewOrderPage
