const db = require('../models').db;
const filterProps = require('../services/utils.js').filterProps;

const authorize = async (ctx, next) => {
  const [strategy, token] = ctx.headers.authorization.split(' ');

  if (strategy === 'Bearer') {
    const user = await db.User.findOne({
      where: {
        auth_token: token
      }
    });

    if (!user) {
      ctx.status = 401;
      ctx.body = {
        errors: ['Token is incorrect.']
      };
      return;
    }

    ctx.user = filterProps(user.dataValues, ['id']);
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