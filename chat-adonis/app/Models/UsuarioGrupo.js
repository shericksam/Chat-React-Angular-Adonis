'use strict'

const Model = use('Model')

class UsuarioGrupo extends Model {
    static get table () {
        return 'usuario_grupos'
      }
}

module.exports = UsuarioGrupo
