
import Dashboard from '@/features/dashboard/Dashboard'
import {LoginCredentials, requireAuth} from '@/server/auth/requireAuth'

export const getServerSideProps = requireAuth(async (ctx: any) => {
  return {props: {user: ctx.user ?? null}}
})

const DashboardPage: React.FC<{user: LoginCredentials | null}> = ({user}) => {
  return <Dashboard  />
}

export default DashboardPage

