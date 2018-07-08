'use strict'

const Schema = use('Schema')

class GrupoSchema extends Schema {
  up () {
    this.create('grupos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('grupos')
  }
}

module.exports = GrupoSchema
