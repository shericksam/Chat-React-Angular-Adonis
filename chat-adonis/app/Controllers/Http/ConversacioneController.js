'use strict'

const Conversacion = use('App/Models/Conversacion')

/**
 * Resourceful controller for interacting with conversaciones
 */
class ConversacioneController {
  /**
   * Show a list of all conversaciones.
   * GET conversaciones
   */
  async index ({ request, response, view }) {

  }

  /**
   * Render a form to be used for creating a new conversacione.
   * GET conversaciones/create
   */
  async create ({ request, response, view }) {

  }

  /**
   * Create/save a new conversacione.
   * POST conversaciones
   */
  async store ({ request, response }) {

  }

  /**
   * Display a single conversacione.
   * GET conversaciones/:id
   */
  async show ({ params, request, response, auth }) {
    const head = request.header('Authorization')
    console.log("HEAD: ",head);
    var me = request.query.me;
    console.log("MEE: ",me);
    try {
      if(await auth.check()){

        var user = await auth.getUser();
        var me = request.query.me;
        console.log("MEE: ",me);
      
        var conv = await Conversacion.query()
        .where("user1",params.id)
        .where("user2",me)
        .first();

        if(!conv){
          conv = await Conversacion.query()
          .where("user2",params.id)
          .where("user1",me)
          .first();
        }
        if(conv){
          response.json(conv.conversacion,200);
        }else{
          response.json([],201);
        }

        

      }
    } catch (error) {
      console.log("ERROR: ",error);
      response.send('Missing or invalid jwt token')
    }
  }

  /**
   * Render a form to update an existing conversacione.
   * GET conversaciones/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update conversacione details.
   * PUT or PATCH conversaciones/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a conversacione with id.
   * DELETE conversaciones/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ConversacioneController
