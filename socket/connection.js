let service = require('./service')()

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connection success')
    socket.on('event', (eventData) => {
      let { eventName, type, data } = eventData
      service[eventName][type](data, (err, data) => {
        if (err) return socket.emit('event-response', { status: false, error: err.toString() })
        return socket.emit('event-response', { status: true, error: null, data: data })
      })
    })
  })
}
