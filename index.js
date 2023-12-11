import express from 'express'

import { corsMiddleware } from './middlewares/cors.js'
import { createMovieRouter } from './routes/movies.js'
import { MovieModel } from './models/mongodb/movie.js'

// export const createApp = ({ movieModel }) => {
const app = express()
app.use(express.json())
app.use(corsMiddleware())
const port = process.env.PORT ?? 1234

const movieModel = MovieModel

app.use('/movies', createMovieRouter({ movieModel }))

// La última opcion a la que entraría (para controlar error, por ej)
app.use((req, res) => {
  res.status(404).send('<h1>404 No se encontró la página</h1>')
})

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})
// }
