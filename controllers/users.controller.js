'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        ctx.status = 401;
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

  async signIn (ctx, next) {
    if (ctx.method !== 'POST') throw new Error('Method not allowed');
    const body = ctx.request.body;
    const user = await this.User.findOne({
      where: {
        email: body.email,
      }
    });
    if (user) {
      const userData = filterProps(body, ['email', 'password']);
      const match = await bcrypt.compare(userData.password, user.dataValues.hash_password);
      if (match) {
        const auth_token = jwt.sign(userData, process.env.JWT_SECRET);
        const userUpdated = await user.update({
          auth_token: auth_token
        });
        ctx.body = filterProps(userUpdated.dataValues, ['id', 'email', 'auth_token']);
        ctx.status = 200;
      } else {
        ctx.status = 401;
        ctx.body = {
          errors: ['Password is incorrect.']
        };
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        errors: ['User does not exist.']
      };
    }
  }

  async getUser (ctx, next) {
    if (ctx.method !== 'GET') throw new Error('Method not allowed');
    if (ctx.user) {
      ctx.body = ctx.user;
      ctx.status = 200;
      await next();
    } else {
      ctx.status = 404;
      ctx.body = {
        errors: ['User does not exist.']
      };
      return;
    }

  }
}

module.exports = UsersController;