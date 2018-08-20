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
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
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

        // Create first empty plan for the user
        const firstPlan = {
          name: 'My first plan',
          meals: [{
            weekday: 'monday',
            meal_type: 'dinner',
            recipe_id: null
          }, {
            weekday: 'tuesday',
            meal_type: 'dinner',
            recipe_id: null
          }, {
            weekday: 'wednesday',
            meal_type: 'dinner',
            recipe_id: null
          }, {
            weekday: 'thursday',
            meal_type: 'dinner',
            recipe_id: null
          }, {
            weekday: 'friday',
            meal_type: 'dinner',
            recipe_id: null
          }, {
            weekday: 'saturday',
            meal_type: 'dinner',
            recipe_id: null
          }, {
            weekday: 'sunday',
            meal_type: 'dinner',
            recipe_id: null
          }]
        };
        let plan = filterProps(firstPlan, ['name']);
        plan.user_id = res.id;
        const newPlan = await db.Plan.create(plan);

        // Create plan_recipe for each meal
        const meals = firstPlan.meals;
        await Promise.all(meals.map(async (meal) => {
          const planRecipe = {
            ...meal,
            plan_id: newPlan.id,
          };
          await db.Plan_recipe.create(planRecipe);
        }));


        // token expires in 30 days and now it has the id for the first plan
        const token = jwt.sign({
          id: res.id,
          plan_id: newPlan.id
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

        // get first plan id
        const plan = await db.Plan.findOne({
          where: {
            user_id: res.id
          },
          attributes: ['id']
        });
        // token expires in 30 days and now it has the id for the first plan
        const token = jwt.sign({
          id: res.id,
          plan_id: plan.id
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

  async updateUser (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'PUT') throw new Error('Method not allowed');

    // Update the user
    const data = ctx.request.body;
    const user_id = ctx.user.id;
    const user = filterProps(data, ['first_name', 'last_name']);
    await this.User.update(user, {
      where: {
        id: user_id
      }
    });

    // Get updatedUser
    const updatedUser = await db.User.findOne({
      where: {
        id: user_id
      },
      attributes: ['id', 'email', 'first_name', 'last_name']
    });

    ctx.body = updatedUser;
    ctx.status = 200;
  }

  async deleteUser (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'DELETE') throw new Error('Method not allowed');

    // Delete the user with the specific id
    const user_id = ctx.user.id;

    await this.User.destroy({
      where: {
        id: user_id
      }
    });

    // Check if the user was deleted correctly
    const user = await this.User.findOne({
      where: {
        id: user_id
      },
      attributes: ['id']
    });

    if (!user) ctx.status = 200;
    else {
      ctx.status = 501;
      ctx.body = {
        errors: ['An error ocurred. User not deleted']
      };
      return;
    }
  }
}

module.exports = UsersController;