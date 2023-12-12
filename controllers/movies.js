const { validateMovie, validatePartialMovie } = require('../schemas/movies')

class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })

    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const movie = await this.movieModel.getById({ id })
    if (movie) {
      if (movie.name === 'CastError') return res.status(400).send({ error: 'id provided is malformed' })
      return res.json(movie)
    }

    res.status(404).json({ message: 'Movie not found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await this.movieModel.create({ input: result.data })

    res.status(201).json(newMovie) // actualizar la caché del cliente
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await this.movieModel.update({ id, input: result.data })

    return res.json(updatedMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.movieModel.delete({ id })

    if (!result) return res.status(404).json({ message: 'Movie not found' })

    return res.json({ message: 'Movie deleted!' })
  }
}

module.exports = { MovieController }
