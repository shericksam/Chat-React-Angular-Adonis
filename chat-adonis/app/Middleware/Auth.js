'use strict'

class Auth {
  async handle ({ request }, next) {
    // call next to advance the request
    await next()
  }
  async wsHandle ({ request,response,auth }, next) {
    // call next to advance the request
    try {
      console.log("Req: ",request);
      console.log("Req: ",request._qs);

      if(request._qs.wsData){
        console.log("Dataaa!!");
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
