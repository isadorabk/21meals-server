const db = require('../models').db;
const jwt = require('jsonwebtoken');

const authorize = async (ctx, next) => {
  const [strategy, token] = ctx.headers.authorization.split(' ');

  if (strategy === 'Bearer') {
    try {
      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.User.findOne({
        where: {
          id: tokenDecoded.id
        },
        attributes: ['id', 'email', 'first_name', 'last_name']
      });
      if (!user) {
        ctx.status = 401;
        ctx.body = {
          errors: ['Token is incorrect.']
        };
        return;
      }
      ctx.user = user.dataValues;
      await next();
    } catch (error) {
      //eslint-disable-next-line
      console.error(error);
    }
  } else {
    ctx.status = 401;
    ctx.body = {
      errors: ['Wrong authorization strategy.']
    };
    return;
  }
};

module.exports = authorize;