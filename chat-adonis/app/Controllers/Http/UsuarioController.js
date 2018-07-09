'use strict'

const Usuario = use('App/Models/User')
    /**
     * Resourceful controller for interacting with usuarios
     */
class UsuarioController {
    /**
     * Show a list of all usuarios.
     * GET usuarios
     */
    async index({ request, response, view }) {}

    /**
     * Render a form to be used for creating a new usuario.
     * GET usuarios/create
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new usuario.
     * POST usuarios
     */
    async store({ request, response }) {
        const userInfo = request.only(['username', 'nombre', 'apellido', 'email', 'password'])

        const user = new Usuario()
        user.username = userInfo.username
        user.nombre = userInfo.nombre
        user.apellido = userInfo.apellido
        user.email = userInfo.email
        user.password = userInfo.password
        user.foto = ""

        try {
            await user.save()
            return response.status(201).json(user)
        } catch (error) {
            return response.status(206).json({ data: error.detail })
        }
    }

    /**
     * Display a single usuario.
     * GET usuarios/:id
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing usuario.
     * GET usuarios/:id/edit
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update usuario details.
     * PUT or PATCH usuarios/:id
     */
    async update({ params, request, response }) {}

    /**
     * Delete a usuario with id.
     * DELETE usuarios/:id
     */
    async destroy({ params, request, response }) {
        const user = await User.find(params.id)
        if (!user) {
            return response.status(404).json({ data: 'No encontrado' })
        }
        await user.delete()

        return response.status(202).json({ data: 'se borro' })
    }
}

module.exports = UsuarioController