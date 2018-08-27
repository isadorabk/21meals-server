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

  mockNewUser: {
    email: 'mario@mariobros.com',
    first_name: 'Mario',
    last_name: 'Bros',
    password: 'YmFuYW5hcw=='
  },

  mockUserCreated: {
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
    },
    findOne: async () => {
      return {
        dataValues: {
          id: 'def456'
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
  },

  mockRecipe: {
    findOne: async () => {
      return [{
        id: '8cef0dcd-6886-4a80-8528-e338b84e53cf',
        title: 'fettuccine in creamy mushroom and sage sauce',
        instructions: 'Bring a large pot of lightly salted water to a boil. Add pasta and cook for 8 to 10 minutes, or until al dente; drain. Heat olive oil a medium saucepan over medium heat, and cook onion and garlic chopped until transparent. Stir in mushrooms, and cook until tender. Mix in heavy cream and sage. Cook and stir until thickened. Toss sauce with cooked fettucine, and season with salt and pepper to serve.',
        serves: 1,
        photo: 'https://static1.squarespace.com/static/5677430b69a91ad1510c421c/t/59ca5daff9a61eef0a3785a6/1506434487912/Mushroom+Spinach+Sage+Pasta%284%29.jpg',
        ingredients: [{
          id: '39cd6e58-0252-4d38-9057-5282e6675122',
          ingredient_id: 1,
          amount: 225,
          measure: 'grams',
          short_measure: 'g'
        },
        {
          id: '1479f07b-70f5-4fa0-b70b-26e923f5c285',
          ingredient_id: 2,
          amount: 100,
          measure: 'grams',
          short_measure: 'g'
        },
        {
          id: 'cb70c588-d239-4cfa-916f-61ef3ec44316',
          ingredient_id: 3,
          amount: null,
          measure: null,
          short_measure: null
        }]
      }];
    }

  },

  mockNewRecipe: {
    title: 'Fettuccine in Creamy Mushroom and Sage Sauce',
    serves: 1,
    instructions: 'Bring a large pot of lightly salted water to a boil. Add pasta and cook for 8 to 10 minutes, or until al dente; drain. Heat olive oil a medium saucepan over medium heat, and cook onion and garlic chopped until transparent. Stir in mushrooms, and cook until tender. Mix in heavy cream and sage. Cook and stir until thickened. Toss sauce with cooked fettucine, and season with salt and pepper to serve.',
    photo: 'https://static1.squarespace.com/static/5677430b69a91ad1510c421c/t/59ca5daff9a61eef0a3785a6/1506434487912/Mushroom+Spinach+Sage+Pasta%284%29.jpg',
    ingredients: [{
      ingredient_id: 1,
      measure_id: 2,
      amount: 225
    }, {
      ingredient_id: 2,
      measure_id: 2,
      amount: 100
    }, {
      ingredient_id: 3,
      measure_id: null,
      amount: null
    }]
  },

  mockRecipeNotFound: {
    findOne: async () => undefined,
    create: async () => {
      return {
        dataValues: {
          id: 'abc123456',
          title: 'Fettuccine in Creamy Mushroom and Sage Sauce',
          serves: 1,
          instructions: 'Bring a large pot of lightly salted water to a boil. Add pasta and cook for 8 to 10 minutes, or until al dente; drain. Heat olive oil a medium saucepan over medium heat, and cook onion and garlic chopped until transparent. Stir in mushrooms, and cook until tender. Mix in heavy cream and sage. Cook and stir until thickened. Toss sauce with cooked fettucine, and season with salt and pepper to serve.',
          photo: 'https://static1.squarespace.com/static/5677430b69a91ad1510c421c/t/59ca5daff9a61eef0a3785a6/1506434487912/Mushroom+Spinach+Sage+Pasta%284%29.jpg',
        }
      };
    }
  },

  mockRecipeIngredient: {
    create: async () => {
      return {

      };
    },
    findAll: async () => {
      return [{
        id: '39cd6e58-0252-4d38-9057-5282e6675122',
        ingredient_id: 1,
        amount: 225,
        measure: 'grams',
        short_measure: 'g'
      },
      {
        id: '1479f07b-70f5-4fa0-b70b-26e923f5c285',
        ingredient_id: 2,
        amount: 100,
        measure: 'grams',
        short_measure: 'g'
      },
      {
        id: 'cb70c588-d239-4cfa-916f-61ef3ec44316',
        ingredient_id: 3,
        amount: null,
        measure: null,
        short_measure: null
      }];
    }
  },

  mockRecipeCreated: {

  }
  

};