const notFound = (req, res, next) => {
    const error = new Error(`not Found - ${req.originalUrl}`)
    res.status(400)
    next(error)
}
const errorHandler = (err, req, res, next) => {
    const status = req.statusCode === 200 ? 500 : res.statusCode
    res.status(status)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = { errorHandler, notFound }