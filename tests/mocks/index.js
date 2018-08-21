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

  user: {
    id: 'abc123',
    email: 'mario@mariobros.com',
    first_name: 'Mario',
    last_name: 'Bros'
  }

};