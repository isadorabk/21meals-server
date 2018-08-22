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

  newUser: {
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
    token: undefined,
    plan_id: 'def456'
  },

  mockPlan: {
    create: async () => {
      return {
        dataValues: {
          id: 'def456',
          name: 'my first plan',
          user_id: 'abc123'
        }
      };
    }
  },
  mockPlanRecipe: {
    create: async () => {
      return {
        dataValues: {
          id: 'ghi789',
          meal_order: 13,
          weekday: 'monday',
          meal_type: 'dinner',
          recipe_id: null,
          plan_id: 'def456'
        }
      };
    }
  }
  

};