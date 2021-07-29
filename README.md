# Moneypot
![Moneypot icon logo](/client/src/components/images/moneypot_logo_white.png)
![Moneypot logo](/client/src/components/images/moneypot_name_white.png)

[Moneypot Live Site](https://moneypot-app.herokuapp.com/)

Moneypot is a paper trading web app that allows users to search for stocks, view company details and current stock prices, purchase and sell stocks, and view their portfolio of investments and balances. 

Moneypot was built using:
- TypeScript
- MERN (MongoDB, Express, React, Node)

## Install and Run
1. In the server folder, run `npm install` then `npm run start`
2. In the client folder, run `npm install` then `npm run start`
3. The API server will run at localhost:3000
4. The React server will run and can be viewed at localhost:3001

## Architectural Pattern and Design

Moneypot was built using an MVC design pattern, separating the data model, business logic, and rendered view. 

### Model
The database schema consists of a users table and transactions table. Users have a name, email, password digest, cash balance, and list of references to transactions. New users are created with an initial $10,000 cash balance, which is updated each time a transaction is made. Transactions have a stock, price, quantity, and reference to a user. Stock purchases are denoted with a positive quantity and stock sales with negative.

### Controller - Backend Rest API

#### Session
Passport middleware is used for managing user authentication and bcrypt is used for hashing and salting passwords. For user sessions, the backend routes query for the current user, register a new user, log in an existing user, log out a user, and query for the current user's name. React Context sends a request to the `/user` backend route, and passes user credentials via cookies using Passport, to provide the current authenticated user to child components.

#### Stocks
Moneypot is integrated with Polygon APIs to request stock information and company details. (Note: Moneypot currently uses the Free Plan version of the Polygon API, which imposes a limit of five API requests per minute, where one request retrieves information for one stock. This version does not offer real-time stock prices so Moneypot uses the previous day closing price as the "current" stock price.) 

To display the stock and company information, the Stock component makes a GET request to the backend API, `/api/stocks/:symbol`, passing in the stock symbol through the route parameters and the user credentials via cookies. The API then makes two Polygon API requests- one to query for the stock information, and one for company information. Once all requested information is received, it is compiled into one JSON object and sent back as the HTTP response. If an error occurs, e.g., the requests per minute exceed the limit, a 404 status code is returned.

![Stock backend route code](/client/src/components/images/stock_backend_route.png)

When a user views a stock, the component makes an API request to `/api/portfolio/balance/:symbol` which responds with their cash balance and number of shares of the stock owned. To validate trades and update the database when a user buys/sells stock, the `/api/stocks/trade` backend route receives a payload with stock and quantity, along with user credentials. Using the user id, a Mongoose query retrieves the user from the database and Mongoose Query Population is used to populate the transactions array with transaction objects. If a user does not have a sufficient cash balance for a buy order or if a user does not have enough shares, determined from their transactions array, for a sell order, a 400 status and error message are returned. If successful, a new transaction is added to the database, the user's transaction array is updated, the user's cash balance is updated, and a response is sent with a 204 status code.

#### Portfolio
To render a user's portfolio, the Portfolio component makes a GET request to `/api/portfolio/shares`, passing in the user credentials via cookies. The transactions list for the user is queried and populated with Mongoose, then a Polygon API request is made for each unique stock to retrieve its price. A dictionary for stock and price, and a dictionary for stock and quantity, along with the user's cash balance is returned as the response.

### View - Features and Technical Challenges
Moneypot 

## User Flow
