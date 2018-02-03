# SkateHub
* Our app "SkateHub," is an app that will connect skaters all over the world in the future. For this capstone project we will be focusing more on a smaller audience for the time being.
* The app itself will let skaters create a profile in which they can enter basic information about themselves, add friends, find skate spots in their area, and socialize, as well as interact with other local skaters in their area. Skateboarders don't have a set spot they skate, part of the skateboarding world is to venture out and find hidden spots.
* This app will allow users to post these spots with a coordinate location for others to travel to. Users will be able to see what spots their friends are skating and invite their friends to come skate that spot. We wish to bring this to both IOS and Android devices by using the open-source Ionic Framework.
* Created by: Derwin Graham, William (Alex) Wood, TJ Bach, Chris Welborn, and Darius Brown

## Prerequisites
* [Node](https://nodejs.org/en/) version 6.11.5 or higher
* [NPM](https://www.npmjs.com/) version 5.3.0 or higher

## Build
* Currently the only thing this project does is connect to a cloud database at mlabs and load some dummy DYNAMIC content. To do so run
```
git clone https://github.com/SCCapstone/SkateHub.git
```
* Change directory into SkateHub
```
cd SkateHub
```
* Change directory into server
```
cd server
```
* Install the necessary dependencies:
```
npm install
```
* To connect to mongodb run:
```
node server.js
```
* A message in your console should pop up saying that you're connected.
* Open another terminal and change into the ionic skatehub directory:
```
cd Skatehub/skatehub
```
* Run npm install to gain all dependencies
```
npm install
```
* Run ionic serve to run in the browser
```
ionic serve
```
* If you run in Google Chrome you can inspect the page and toggle the device simulator to view on mobile phones

## Unit Tests

* To run the unit tests, first:
```
cd Skatehub/skatehub
```
* Then run the following command:
```
npm run test
```
* The tests should begin using the Karma testing framework and open a chrome browser as well as display the output in the terminal.

## E2E Tests

* To run the e2e tests, first have a terminal running the server and a terminal running the ionic serve.
* Then, in a 3rd terminal, first:
```
cd Skatehub/skatehub
```
* Then run the e2e test:
```
npm run e2e
```
* The tests should begin and display the output.
