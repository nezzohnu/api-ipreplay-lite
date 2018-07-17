import * as mongoose from 'mongoose'
import * as chai from 'chai'
import * as dotenv from 'dotenv'

dotenv.config({
  path: './config/variables.env'
})

// describe(__filename, () => {
//   describe('DB Connection', () => {
//     it('Should connect to the database', () => {
//       return mongoose.connect(process.env.DB)
//         .then(() => {
//             let connected = true;
//             chai.assert(connected == true)
//         }, err => {
//             console.log(err)
//         })
//     })
//   })
// })
