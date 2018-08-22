exports.mockData = {
  mockUser: {
    findOne: async () => {
      return {
        dataValues: {
          id: 'abc123',
          email: 'mario@mariobros.com',
          first_name: 'Mario',
          last_name: 'Bros'
        }
      };
    }
  },

  mockUserNotFound: {
    findOne: async () => undefined,
    create: async () => {
      return {
        dataValues: {
          id: 'abc123',
          email: 'mario@mariobros.com',
          first_name: 'Mario',
          last_name: 'Bros'
        }
      };
    }
  },

  user: {
    id: 'abc123',
    email: 'mario@mariobros.com',
    first_name: 'Mario',
    last_name: 'Bros'
  },

  createUser: {
    email: 'mario@mariobros.com',
    first_name: 'Mario',
    last_name: 'Bros',
    password: 'YmFuYW5hcw=='
  },

  userCreated: {
    id: 'abc123',
    first_name: 'Mario',
    last_name: 'Bros',
    email: 'mario@mariobros.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiYzEyMyIsImlhdCI6MTUzNDg2NjY0N30.mGPITCU_ylJfNZxpjOjoBpFp2kg55KtwFnUdl6oGFbc',
    plan_id: 'def456'
  }

};