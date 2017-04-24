const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getCharacters', mid.requiresLogin, controllers.Characters.getCharacters);
  app.post('/getCharacters', mid.requiresLogin, controllers.Characters.getCharacters);
  app.post('/deleteCharacter', mid.requiresLogin, controllers.Characters.deleteCharacter);
  app.post('/updateCharacter', mid.requiresLogin, controllers.Character.updateCharacter);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/characters', mid.requiresLogin, controllers.Characters.charactersPage);
  app.post('/characters', mid.requiresLogin, controllers.Characters.create);
  app.get('/characters/:name', mid.requiresLogin, controllers.Character.characterPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
