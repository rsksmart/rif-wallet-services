import { ErrorRequestHandler } from 'express'

export class CustomError extends Error {
  status: number;
  constructor (message: string, status: number) {
    super(message)
    this.status = status
  }
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  console.error(error)
  res.status(status).send(message)
  next()
}
