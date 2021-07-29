# Moneypot
![Moneypot icon logo](/client/src/images/moneypot_logo_white.png)
![Moneypot logo](/client/src/images/moneypot_name_white.png)

[Moneypot Live Site](https://moneypot-app.herokuapp.com/)

Moneypot is a paper trading web app that allows users to search for stocks, view company details and current stock prices, purchase and sell stocks, and view their portfolio of investments and balances. 

Moneypot was built using:
- TypeScript
- MERN (MongoDB, Express, React, Node)

## Install and Run
1. In the **server** folder, run `npm install` then `npm run start`
2. In the **client** folder, run `npm install` then `npm run start`
3. The API server will run at localhost:3000
4. The React server will run and can be viewed at localhost:3001

## Architectural Pattern and Design

Moneypot was built using an MVC design pattern, separating the data model, controller logic, and rendered view. Mongoose was used to manage representations of data from the MongoDB database, as well as for schema validation. The backend routes provide the API (controller) that interfaces between the model and the view to accept requests from the view, manipulate the model, and send a response back to the view. The React components are the views that are rendered to the user and allow the user to make changes to the model indirectly via the controller. This pattern provides a connected process with a separation of concerns that lends itself to better maintainability and scalability.
The project is divided into client and server folders, separating the frontend components from backend routes.

### Model
The database schema consists of a users table and transactions table. Users have a name, email, password digest, cash balance, and list of references to transactions. New users are created with an initial $10,000 cash balance, which is updated each time a transaction is made. Transactions have a stock, price, quantity, and reference to a user. Stock purchases are denoted with a positive quantity and stock sales with negative.

### Controller - Backend Rest API

#### Session
Passport middleware is used for managing user authentication and bcrypt is used for hashing and salting passwords. For user sessions, the backend routes query for the current user, register a new user, log in an existing user, log out a user, and query for the current user's name. React Context sends a request to the `/user` backend route, and passes user credentials via cookies using Passport, to provide the current authenticated user to child components.

#### Stocks
Moneypot is integrated with Polygon APIs to request stock information and company details. 
>Note: Moneypot currently uses the Free Basic version of the Polygon API, which imposes a limit of five API requests per minute, where one request retrieves information for one stock. This version does not offer real-time stock prices so Moneypot uses the previous day closing price as the "current" stock price.

To display the stock and company information, the Stock component makes a GET request to the backend API, `/api/stocks/:symbol`, passing in the stock symbol through the route parameters and the user credentials via cookies. The API then makes two Polygon API requests- one to query for the stock information, and one for company information. Once all requested information is received, it is compiled into one JSON object and sent back as the HTTP response. If an error occurs, e.g., the requests per minute exceed the limit, a 404 status code is returned.

![Stock backend route code](/client/src/images/stock_backend_route.png)

When a user views a stock, the component makes an API request to `/api/portfolio/balance/:symbol` which responds with their cash balance and number of shares of the stock owned. To validate trades and update the database when a user buys/sells stock, the `/api/stocks/trade` backend route receives a payload with stock and quantity, along with user credentials. Using the user id, a Mongoose query retrieves the user from the database and Mongoose Query Population is used to populate the transactions array with transaction objects. If a user does not have a sufficient cash balance for a buy order or if a user does not have enough shares, determined from their transactions array, for a sell order, a 400 status and error message are returned. If successful, a new transaction is added to the database, the user's transaction array is updated, the user's cash balance is updated, and a response is sent with a 204 status code.

#### Portfolio
To render a user's portfolio, the Portfolio component makes a GET request to `/api/portfolio/shares`, passing in the user credentials via cookies. The transactions list for the user is queried and populated with Mongoose, then a Polygon API request is made for each unique stock to retrieve its price. A dictionary for stock and price, a dictionary for stock and quantity, and the user's cash balance is returned as the response.

### View - Features and Technical Challenges
#### Signup and Login
The Signup and Login components render the view for the signup and login pages, respectively. They consist of a form that prompts the user to enter a name, email, and password to create a new account or to login with email and password. These components make POST requests to the backend session APIs to create a new user or authenticate the user.
#### Homepage
The Homepage component renders a search bar to search for stocks, and for signed-in users, a personalized greeting. When a search is made, users are directed to the url containing the symbol in the route parameters, which renders the Stock view.
#### Stock and Trade
The Stock component makes GET requests to the backend stock APIs to display stock and company information, as well as user information for the particular stock for authenticated users. The Trade component is nested in the Stock component and it allows users to buy or sell a specified number of shares, which results in a POST request to the backend stocks API. 

A challenge with the Trade component was that after stock is bought or sold, a re-render was necessary to update the user's stock information. However, a re-render was only desirable after a *successful* transaction. React's Effect hook takes an optional second argument, a dependency array that will initiate a re-render if any dependency changes. Thus, I added a `click` variable to the local state that was initialized at zero, and would only increment with every successful transaction. Then, I added the click variable to the dependency array.

![Trade component code](/client/src/images/trade_component_code.png)

#### Navbar and Searchbar
The Navbar is a reusable component that appears on every page of the app. It contains the Moneypot logo, which can be clicked to return to the homepage. For logged in users, it contains navigation buttons to Home, Portfolio, and Logout. If not logged in, it contains navigation buttons to Home, Sign Up, and Sign In. It also contains the Searchbar nested component, which allows the user to search for a stock symbol, which directs the user to the Stock view.
#### Portfolio
The Portfolio component lists the user's portfolio value(total of stock and cash), stock value, and cash balance. It also provides a chart of the user's investments, with stock ticker, quantity, and current price. This component is built by making a GET request to the backend portfolio API upon initial render.

A challenge with this component was a race condition that was caused by asynchronously setting the local state with React hooks. The Effect hook makes an axios request to query data from the backend API and the data needs some manipulation before it can be set to the local state. If the data is first set to state, then the state values are manipulated, they will evaluate to undefined. To overcome this, I created temporary variables within the Effect hook to store the response data from the axios request, then manipulated those variables and assigned the final values to the local state.

![Portfolio component code](/client/src/images/portfolio_component_code.png)

## User Flow and Design Decisions

Many of the design elements included components from Material-UI, the React UI framework.

1. Sign Up/Log In - 
The signup and login pages were built using multiple Material-UI components for a clean, responsive layout. Since Moneypot was designed to allow users to browse stocks without creating an account, I wanted the search feature to be accessible from all pages. Although many sites omit the navbar from the signup and login pages, I decided to include the navbar so the search tool can be made accessible without an additional click to return to the homepage.
![User flow step 1](/client/src/images/view1.png)
2. Home - 
The home page for authenticated users includes a welcome message with their name, which makes clear to the user that they are signed in. The home page is simple, with a few words of text and a large search bar for accessing the site's main feature.
![User flow step 2](/client/src/images/view2.png)
3. Stocks - 
The stock details page lists details about the stock and company, without becoming too extensive. If no user is logged in, the bottom of the stocks page displays a button to navigate to the login page in order to trade the stock. If a user is logged in, only relevant information needed for trading this particular stock are provided- the user's cash balance and number of shares owned. When a transaction is successfully made, a toast notification briefly appears at the bottom of the page for two seconds, notifying the user that the order was completed. This notification was designed to be unintrusive and easy to disregard without requiring user interaction, e.g., clicking out of a modal in order to clear the message.
![User flow step 3](/client/src/images/view3.png)
4. Portfolio - 
The user portfolio highlights the most important information at the top, the user's balances. Below that, a Material UI chart was used to detail the investments held by the user in a concise manner.
![User flow step 4](/client/src/images/view4.png)

