'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.group(() => {
    Route.resource('user', 'UsuarioController')
    Route.post('/user/login', 'UsuarioController.login')
}).prefix('api/v1')

Route.get('/', ({ request }) => {
  return { greeting: 'Hello world in JSON' }
})

Route.resource("/usuarios","UsuarioController");

Route.resource('/conversacion','ConversacioneController');
