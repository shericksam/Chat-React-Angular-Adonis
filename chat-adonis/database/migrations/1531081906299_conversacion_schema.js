'use strict'

const Schema = use('Schema')

class ConversacionSchema extends Schema {
  up () {
    this.create('conversacions', (table) => {
      table.increments()
      table.integer("user1")
      table.integer("user2")
      table.jsonb("conversacion")
      table.timestamps()
    })
  }

  down () {
    this.drop('conversacions')
  }
}

module.exports = ConversacionSchema
