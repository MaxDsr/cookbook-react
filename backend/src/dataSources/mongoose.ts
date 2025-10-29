import mongoose from 'mongoose'
import winston from 'winston'

export const mongooseDataSource = {
  run: async () => {
    try {
      return await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
      winston.error(error)
    }
  },

  stop: async () => {
    try {
      return await mongoose.connection.destroy()
    } catch (error) {
      winston.error(error)
    }
  }
}
