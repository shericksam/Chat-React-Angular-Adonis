'use strict'

const Schema = use('Schema')

class UsuariosGrupoSchema extends Schema {
  up () {
    this.create('usuarios_grupos', (table) => {
      table.increments()
      table.integer("fk_usuario")
      table.integer("fk_grupo")
      table.timestamps()
    })
  }

  down () {
    this.drop('usuarios_grupos')
  }
}

module.exports = UsuariosGrupoSchema
