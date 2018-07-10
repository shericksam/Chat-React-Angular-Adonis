'use strict'

const Schema = use('Schema')

class ConversacionGrupoSchema extends Schema {
  up () {
    this.create('conversacion_grupos', (table) => {
      table.increments()
      table.integer("fk_grupo")
      table.jsonb("conversacion")
      table.timestamps()
    })
  }

  down () {
    this.drop('conversacion_grupos')
  }
}

module.exports = ConversacionGrupoSchema
