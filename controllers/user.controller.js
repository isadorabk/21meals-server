'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const atob = require('atob');
const filterProps = require('../services/utils.js').filterProps;

class UsersController {
  constructor (userModel) {
    if (!userModel) throw new Error('User model not provided');
    this.User = userModel;
    this.createUser = this.createUser.bind(this);
    this.signIn = this.signIn.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  async createUser (ctx, next) {
    if (ctx.method !== 'POST') throw new Error('Method not allowed');
    const userData = ctx.request.body;
    if (userData.email && userData.password) {
      let user = await this.User.findOne({
        where: {
          email: userData.email,
        }
      });
      if (user) {
        ctx.status = 400;
        ctx.body = {
          errors: ['User already exists.']
        };
      } else {
        user = filterProps(userData, ['email', 'first_name', 'last_name']);
        user.hash_password = await bcrypt.hash(userData.password, 10);
        let newUser = await this.User.create(user);
        ctx.body = filterProps(newUser.dataValues, ['id', 'email', 'first_name', 'last_name']);
        ctx.status = 201;
      }
    } else {
      ctx.status = 406;
      ctx.body = {
        errors: ['Email and/or password needed']
      };
    }
  }

}

module.exports = UsersController;