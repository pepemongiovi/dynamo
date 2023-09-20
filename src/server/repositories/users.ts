import db from '../db'
import {hash} from 'argon2'
import {IGetUserByEmail, ISignUp} from '@/validation/auth'
import {Prisma} from '@prisma/client'

export const createNewUser = async (input: ISignUp) => {
  const {email, name, phone, documentNumber, zipcode, password} =
    input

  const userExists = await db.user.findFirst({
    where: {OR: [{email}, {documentNumber}]}
  })
  if (userExists) {
    throw new Error(
      `Já existe um usuário com o ${
        userExists.documentNumber === documentNumber ? 'documento' : 'email'
      } informado`
    )
  }

  const hashedPassword = await hash(password)
  const data: Prisma.UserCreateInput = {
    name,
    email,
    phone,
    password: hashedPassword,
    documentNumber,
    zipcode
  }
  const user = await db.user.create({data})

  return {
    status: 201,
    message: 'Account created successfully',
    result: user
  }
}
export const findUserByEmail = async (input: IGetUserByEmail) => {
  const user = await db.user.findFirst({
    where: {email: input.email}
  })

  return {
    status: 200,
    result: user
  }
}
