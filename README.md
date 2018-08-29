![](https://user-images.githubusercontent.com/35597953/44659838-df236f80-aa05-11e8-86c8-7a4e1f8d8e49.png)



21Meals is a meal planner and a shopping organizer that allows you to input your favorite recipes, arrange them through the week and have a customized grocery list based on your weekly plan.

For the client repo, please visit: [21Meals - client](https://github.com/isadorabk/21meals-client)




## Screenshots

![](https://user-images.githubusercontent.com/35597953/44659842-e34f8d00-aa05-11e8-8f6e-dcf432928d0f.png)




## Getting started

### Prerequisites

- [Node](https://nodejs.org/en/)
- [mySQL](https://www.mysql.com/)
- [npm](https://www.npmjs.com/)



### Running the server

1. #### Clone the repo.

   ```
   $ git clone https://github.com/isadorabk/21meals-server.git  
   $ cd 21meals-server
   ```

2. #### Install dependancies

   ```
   $ npm install
   ```

3. #### Connect mySQL database

   In the terminal, run:

   ```
   $ mysql --password -u <your username>
   ```



   When prompted, enter your mySQL password.



   Now create a new database:

   ```
   $ CREATE DATABASE <database name>;
   ```

4. #### Set up your .env file

   Set up your **.env** file following the structure of the **.env.example** file



## Usage

1. ### Start the server:

```
 $ cd 21meals-server  
 $ npm start
```



2. ### Postman collection

   Use the [21Meals.postman_collection.json](https://github.com/isadorabk/21meals-server/blob/develop/_docs/21meals.postman_collection.json) to test all API endpoints.


3. ### Set up the front end

   Go to [21Meals - client](https://github.com/isadorabk/21meals-client) and follow the instructions in the README.md file.


## Tech Stack

Back-end built with:

- [Koa](https://koajs.com/)
- [mySQL](https://www.mysql.com/)
- [Sequelize](http://docs.sequelizejs.com/)



## Developers team

- Isadora Bassetto Kwiatkowski - [GitHub](https://github.com/isadorabk) - [LinkedIn](https://www.linkedin.com/in/isadora-bassetto-kwiatkowski/)
- Jordi M. Zambrano - [GitHub](https://github.com/nickschoey) - [LinkedIn](https://www.linkedin.com/in/jordi-zambrano/)
- Volodymyr Gromoglasov - [GitHub](https://github.com/gromoglasov) - [LinkedIn](https://www.linkedin.com/in/gromoglasov/)




## License

This project is licensed under the MIT License.
