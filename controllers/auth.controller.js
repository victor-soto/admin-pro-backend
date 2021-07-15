const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generateJWT } = require('../helpers/jwt');
const User = require('../models/user.model');

const login = async(req, res = response) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
	ok: false,
	msg: 'Email not found'
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
	ok: false,
	msg: 'Password is invalid'
      });
    }

    const token = await generateJWT(user.uid);

    res.json({
      ok: true,
      msg: token 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected error'
    });
  }

};

module.exports = {
  login
}

