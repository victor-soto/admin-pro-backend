const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generateJWT } = require('../helpers/jwt');
const User = require('../models/user.model');

const getUsers = async(req, res) => {

  const users = await User.find({}, 'name email role google');

  res.json({
    ok: true,
    users
  });

}

const createUser = async(req, res = response) => {

  const { email, password } = req.body;

  try {

    const emailTaken = await User.findOne({ email });

    if (emailTaken) {
      return res.status(400).json({
	ok: false,
	msg: 'Email already exists'
      });
    }

    const user = new User(req.body);
    
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password);

    await user.save();

    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected error... Check logs.'
    });
  }


}

const updateUser = async(req, res = response) => {

  const uid = req.params.id;

  try {

    const user = await User.findById(uid);

    if (!user) {
      
      return res.status(404).json({
	ok: false,
	msg: 'User not found'
      });
    }

    const { password, google, email, ...fields } = req.body;

    if (user.email !== req.body.email) {
      const userByEmail = await User.findOne({ email });

      if (userByEmail) {

	return res.status(400).json({
	  ok: false,
	  msg: 'User with this email already exists'
	});
      }
    }

    fields.email = email;
    const updatedUser = await User.findByIdAndUpdate(uid, fields, { new: true });

    res.json({
      ok: true,
      updatedUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Unexpected error'
    });
  }

}

const deleteUser = async(req, res = response) => {

  const uid = req.params.id;

  try {

    const user = await User.findById(uid);
    if (!user) {
      
      return res.status(404).json({
	ok: false,
	msg: 'User not found'
      });
    }

    await User.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: 'User was deleted'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Cannot delete this user'
    });

  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}

