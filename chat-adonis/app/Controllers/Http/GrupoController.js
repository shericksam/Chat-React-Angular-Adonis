'use strict'

const Grupo = use('App/Models/Grupo')
const UsuarioGrupo = use('App/Models/UsuarioGrupo')


/**
 * Resourceful controller for interacting with grupos
 */
class GrupoController {
  /**
   * Show a list of all grupos.
   * GET grupos
   */
  async index ({ request, response, auth }) {

    try{
      if(await auth.check()){
        let user = await auth.getUser();

        if(user){

          let grupos = await Grupo.query()
          .table('grupos')
          .innerJoin("usuario_grupos","grupos.id","usuario_grupos.fk_grupo")
          .where("fk_user",user.id)
          .fetch()
          return response.status(200).json(grupos);
        }
       
        
      }else{
        return response.status(401).json({mag:"Not Authorized"});
      }
    }catch(error){
      console.log("ERROR: ",error);
      return response.status(400).json([]);
    }

  }

  /**
   * Render a form to be used for creating a new grupo.
   * GET grupos/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new grupo.
   * POST grupos
   */
  async store ({ request, response }) {

    try{
      var grupo = request.only(['users','nombre']);
      console.log("Request G: ",request);
      console.log("GRUPO: ",grupo);
      var ng = new Grupo();
      ng.nombre = grupo.nombre;
      ng.foto = "";
      await ng.save();
      var usersIn = [];

      for (let i = 0; i < grupo.users.length; i++) {
        const element = grupo.users[i];
        usersIn.push({
          fk_user:element,
          fk_grupo:ng.id
        });
      }
      console.log("ARRAY: ",usersIn);

      try{
        if(ng){
          let usersCreated = await UsuarioGrupo.createMany(usersIn);
          console.log("USERS GRUPO: ",usersCreated);
          
          return response.status(200).json({
            grupo:ng
          });
        }else{
          return response.status(400).json({
            msg:"No se hizo"
          });
        }
      }catch(error){
        console.log("ERROR GROUP 2: ",error);
      }
    }catch(error){
      console.log("ERROR GROUP 1: ",error);
    }

    
    

  }

  /**
   * Display a single grupo.
   * GET grupos/:id
   */
  async show ({ params, request, response, view }) {

  }

  /**
   * Render a form to update an existing grupo.
   * GET grupos/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update grupo details.
   * PUT or PATCH grupos/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a grupo with id.
   * DELETE grupos/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = GrupoController
