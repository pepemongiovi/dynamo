import Dashboard from '@/features/dashboard/Dashboard'
import {LoginCredentials, requireAuth} from '@/server/auth/requireAuth'
import {useRouter} from 'next/router'

export const getServerSideProps = requireAuth(async (ctx: any) => {
  return {props: {user: ctx.user ?? null}}
})

const App: React.FC<{user: LoginCredentials | null}> = ({user}) => {
  return <Dashboard />
}

export default App
