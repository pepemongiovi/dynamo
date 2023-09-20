import createRouter from '../createRouter'
import {z} from 'zod'
import {signUpSchema} from '@/validation'
import {createUser} from '../controllers/users'

export default createRouter().mutation('sign-up', {
  input: signUpSchema,
  resolve: async ({input}) => {
    const res = await createUser(input)
    return res
  }
})
