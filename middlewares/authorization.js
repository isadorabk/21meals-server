const db = require('../models').db;

const authorize = async (ctx, next) => {
  const [strategy, token] = ctx.headers.authorization.split(' ');

  if (strategy === 'Bearer') {
    const user = await db.User.findOne({
      where: {
        auth_token: token
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

  } else {
    ctx.status = 400;
    ctx.body = {
      errors: ['Wrong authorization strategy.']
    };
    return;
  }

};

module.exports = authorize;