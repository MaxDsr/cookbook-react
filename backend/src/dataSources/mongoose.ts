import mongoose from 'mongoose'

export const mongooseDataSource = {
  run: async () => {
    try {
      return await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
    }
  },

  stop: async () => {
    try {
      return await mongoose.connection.destroy()
    } catch (error) {
    }
  }
}
