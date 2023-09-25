import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const signUpSchema = loginSchema.extend({
  name: z.string(),
  phone: z.string(),
  documentNumber: z.string(),
  zipcode: z.string()
})

export const getUserByEmailSchema = z.object({
  email: z.string().email()
})

export const getUserByUserIdSchema = z.object({
  userId: z.string()
})

export type ILogin = z.infer<typeof loginSchema>
export type ISignUp = z.infer<typeof signUpSchema>
export type IGetUserByEmail = z.infer<typeof getUserByEmailSchema>
export type IGetUserByUserId = z.infer<typeof getUserByUserIdSchema>
