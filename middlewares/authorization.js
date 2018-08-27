const jwt = require('jsonwebtoken');

const authorize = (User) => async (ctx, next) => {
  const [strategy, token] = ctx.headers.authorization.split(' ');

  if (strategy === 'Bearer') {
    try {
      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        where: {
          id: tokenDecoded.id
        },
        attributes: ['id', 'email', 'first_name', 'last_name']
      });
      if (!user) {
        ctx.status = 404;
        ctx.body = {
          errors: ['User does not exist.']
        };
        return;
      }
      ctx.user = user.dataValues;
      await next();
    } catch (error) {
      throw error;
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