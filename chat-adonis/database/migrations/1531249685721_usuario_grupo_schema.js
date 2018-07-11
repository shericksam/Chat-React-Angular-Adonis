'use strict'

const Schema = use('Schema')

class UsuarioGrupoSchema extends Schema {
  up () {
    this.create('usuario_grupos', (table) => {
      table.increments()
      table.integer("fk_user")
      table.integer("fk_grupo")
      table.timestamps()
    })
  }

  down () {
    this.drop('usuario_grupos')
  }
}

module.exports = UsuarioGrupoSchema
