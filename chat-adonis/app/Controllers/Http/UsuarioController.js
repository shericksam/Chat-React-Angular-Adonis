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
    async index({ request, response, view, auth }) {
        try{
            if(await auth.check()){
                let user = await auth.getUser();
                console.log("user token: ",user);
                var users = await Usuario
                .query()
                .where("id","!=",user.id)
                .fetch();
                return response.json(users,200);
            }
        }catch(error){
            return response.json([],401);
        }

       
        
    }


    async login({request, auth, response }){
        var user = request.body.email;
        var pass = request.body.password;
        
        const us = await auth.attempt(user, pass);
        var usuario = await Usuario.query().where("email",user).first();
        return response.json({
            user:usuario,
            token:us.token
        },200);
    }

    /**
     * Render a form to be used for creating a new usuario.
     * GET usuarios/create
     */
    async create({ request, response, view }) {}


    async store({ request, response ,auth }) {

        const userInfo = request.only(['username', 'nombre', 'apellido', 'email', 'password'])
        console.log("userinfooo: ",userInfo);
        const user = new Usuario()
        user.username = userInfo.username
        user.nombre = userInfo.nombre
        user.apellido = userInfo.apellido
        user.email = userInfo.email
        user.password = userInfo.password
        user.foto = ""

        try {
            await user.save()
            const us = await auth.attempt(userInfo.email, userInfo.password);
            //let user = auth.getUser();

            return response.status(201).json({
                user:user,
                token:us.token
            })
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