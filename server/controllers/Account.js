const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! ALL FIELDS ARE REQUIRED!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/characters' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! ALL FIELDS ARE REQUIRED!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! PASSWORDS DO NOT MATCH' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/characters' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 1000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const changePass = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up security flaws
  req.body.pass = `${req.body.pass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if (!req.body.pass || !req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ error: 'RAWR! ALL FIELDS ARE REQUIRED!' });
  }

  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ error: 'RAWR! PASSWORDS DO NOT MATCH' });
  }

  return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
    const accountData = {
      salt,
      password: hash,
    };

    return Account.AccountModel.updateById(req.body.username, accountData, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.status(200).json({ error: 'Password was successfully changed' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.changePass = changePass;
module.exports.getToken = getToken;
