# CheckIt

This application can be used to read basic product information from an amazon product page and display it. It uses `rack-proxy` middleware to intercept responses from amazon.com and parse the relevant information. Once the information is parsed, it is pushed into a postgresql database and stored for later viewing. If the same information is retrieved multiple times it will simply overwrite the previously stored information.

## Demo

The app is currently deployed to https://ancient-bayou-15483.herokuapp.com/

## Dependencies

This app is build using Ruby 2.4.1p111 (check .ruby-version if in doubt) and rails 5.2 in api-only mode

You will also need `yarn` (ideally the latest) and `node 9.11`

## Installing and Running

1. clone the repo locally
2. make sure you have ruby 2.4.1
3. `bundle`
4. `cd frontend && yarn && cd ..`
5. I prefer to open two terminal windows and run the webpack server and rails server on different windows
  - `rails s -p 3001`
  - `cd frontend && yarn start`

Now you can run it locally

## Key parts of the code

| Part | Location | Role |
|:---|:---|:---|
| Proxy | [lib/amazon_proxy.rb](https://github.com/radixhound/checkit/blob/master/lib/amazon_proxy.rb) | Proxy request from the browser. Parse and store data before responding as json |
| Amazon Parser | [app/data_objects/amazon_parser.rb](https://github.com/radixhound/checkit/blob/master/app/data_objects/amazon_parser.rb) | Uses Nokogiri to grab and process data from the html. |
| React App | [frontend/App.js](https://github.com/radixhound/checkit/blob/master/frontend/App.js) | Simple react app, mostly in one component. |
| Rails | / | Rails really isn't being used much in this case, just one endpoint to render products.|

## Things learned

As I worked through the problem, I started with Rails as the server because I knew it would be quick to try things. Once it was working it became pretty obvious that it would be more ideal to use an async web server to handle the proxying because the server spends a lot of time waiting for the response from the third party. The next place I would go would be to set up a quick express server and do the proxying from there. Then Rails would become more of a simple CRUD setup and the various components would each do one thing well.

One key assumption behind all of this is that there is no easy way to get a json representation of the data we're looking for, so really this is just a lot of workarounds to get around the fact that Amazon doesn't want robots scraping their site, so we're pretending to be a browser. Maybe there's a blind spot there for me. I'd love to know if there was an easier way and it just didn't come into my field of perspective!

## Notable things skipped

- *Testing* I kept an eye out for where it would make sense to drop in tests, but they never really rose to a priority. Testing that is hightly dependent on third party servers is tricky and would have cost a lot of time. I would drop some tests onto the proxy first then onto the parser by creating some static html files to test against...
- *UI / UX* It's important to have a real problem to solve to be able to get a clear vision for the UI, so I minimized the amount of effort in this department. Most styling comes from `create-react-app` default styles plus `milligram.io` css styles with a few overrides.