'use strict';

const bcrypt = require('bcrypt');
const atob = require('atob');
const jwt = require('jsonwebtoken');
const filterProps = require('../services/utils.js').filterProps;
const db = require('../models').db;

class UsersController {
  constructor (userModel) {
    if (!userModel) throw new Error('User model not provided');
    this.User = userModel;
    this.createUser = this.createUser.bind(this);
    this.signIn = this.signIn.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  async createUser (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'POST') throw new Error('Method not allowed');

    const userData = ctx.request.body;
    
    //Check if the request has email and password
    if (userData.email && userData.password) {
      // Check if there's already an user with this email
      let user = await this.User.findOne({
        where: {
          email: userData.email,
        }
      });
      // if there's already a user, send an error
      if (user) {
        ctx.status = 401;
        ctx.body = {
          errors: ['User already exists.']
        };
        
      } else {
        // If there's no user, create a new one
        user = filterProps(userData, ['email', 'first_name', 'last_name']);
        user.hash_password = await bcrypt.hash(userData.password, 10);
        let newUser = await this.User.create(user);
        const { hash_password, updated_at, created_at, ...res } = newUser.dataValues;
        // token expires in 30 days
        const token = jwt.sign({
          id: res.id
        }, process.env.JWT_SECRET, {
          expiresIn: 2592000
        });
        res.token = token;
        ctx.body = res;
        ctx.status = 201;
      }
      // if there's no email or password, send an error
    } else {
      ctx.status = 406;
      ctx.body = {
        errors: ['Email and/or password needed']
      };
    }
  }

  async signIn (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    const basic = ctx.headers.authorization.split(' ');
    if (basic.length < 2 && basic[0] !== 'Basic') throw new Error('Missing basic authentication header');

    const [ email, password ] = atob(basic[1]).split(':');
  
    const user = await this.User.findOne({
      where: {
        email
      },
      attributes: ['id', 'email', 'first_name', 'last_name', 'hash_password']
    });
    
    if (user) {
      const match = await bcrypt.compare(password, user.dataValues.hash_password);
      if (match) {
        const { hash_password, ...res } = user.dataValues;
        // token expires in 30 days
        const token = jwt.sign({
          id: res.id
        }, process.env.JWT_SECRET, {
          expiresIn: 2592000
        });
        res.token = token;
        ctx.body = res;
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
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');
    if (ctx.user) {
      ctx.body = ctx.user;
      ctx.status = 200;
      await next();
    } else {
      // Send an error if there's no user with this email
      ctx.status = 404;
      ctx.body = {
        errors: ['User does not exist.']
      };
      return;
    }

  }
}

module.exports = UsersController;