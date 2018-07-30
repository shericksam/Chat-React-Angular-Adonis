'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
    up() {
        this.create('users', (table) => {
            table.increments()
            table.string('username', 80).notNullable().unique()
            table.string('nombre', 80).notNullable()
            table.string('apellido', 80).notNullable()
            table.string('foto', 80).notNullable()
            table.boolean('conectado')
            table.string('email', 254).notNullable().unique()
            table.string('sid', 300)
            table.string('password', 60).notNullable()
            table.timestamps()
        })
    }

    down() {
        this.drop('users')
    }
}

module.exports = UserSchema