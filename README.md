# CheckIt

This application can be used to read basic product information from an amazon product page and display it. It uses `rack-proxy` middleware to intercept responses from amazon.com and parse the relevant information. Once the information is parsed, it is pushed into a postgresql database and stored for later viewing. If the same information is retrieved multiple times it will simply overwrite the previously stored information.



## Demo

The app is currently deployed to https://ancient-bayou-15483.herokuapp.com/

## Installing and Running

### Dependencies

This app is build using Ruby 2.4.1p111 (check .ruby-version if in doubt) and rails 5.2 in api-only mode

You will also need `yarn` (ideally the latest) and `node 9.11`

1. clone the repo locally
2. make sure you have ruby 2.4.1
3. `bundle`
4. `cd frontend && yarn && cd ..`
5. I prefer to open two terminal windows and run the webpack server and rails server on different windows
  - `rails s -p 3001`
  - `cd frontend && yarn start`

Now you can run it locally
