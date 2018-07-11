'use strict'

class Auth {
  async handle ({ request }, next) {
    // call next to advance the request
    await next()
  }
  async wsHandle ({ request,response,auth }, next) {
    // call next to advance the request
   
    try {
     
      if(request._qs){
        
        //var user = await auth.getUser();
      }
    } catch (error) {
      console.log("ERROR: ");
      response.send('Missing or invalid jwt token')
    }
    await next()
  }
}

module.exports = Auth
