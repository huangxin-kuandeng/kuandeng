const mock = {}
require('fs').readdirSync(require('path').join(`${__dirname}/src/mock`)).forEach((file) => {
  Object.assign(mock, require(`./src/mock/${file}`))
})

module.exports = mock
