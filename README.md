# Kattapon!

*Kattapon!* is a digital capsule-prize machine concept for indie online storefronts. The website emulates the experience of using real-life gashapon machines with a stockable inventory system and random prize distribution. 

**NOTE**: This repository is currently not being maintained, but remains here for access and viewing should the project ever be picked up again in the future.

---

<center>

![Clicking the capsule machine turns the crank and displays your prize!](/.github/resources/crank.gif)

</center>

![Welcome Screen](/.github/resources/welcome-redeem-page.png)

![Sign-Up Screen](/.github/resources/sign-up-screen.png)

![Dashboard - Inventory](/.github/resources/dashboard-inventory.png)

![Dashboard - Tickets](/.github/resources/dashboard-tickets.png)

# Contributor Setup Instructions
> **⚠️ WARNING**  
> The Firestore and Storage rules for this project are not configured for safe production use. Deploy at your own risk.

**Minimum Node Version**: 14.x

1. Run the following commands to get the source code set up on your local machine:
```
git clone https://github.com/plu-gachateam/gashapon.git
cd gashapon
npm ci
cd functions && npm ci && cd ../
```
These commands should download the source code and perform a clean install of the dependencies using `npm ci` without modifying `package-lock.json`.

In order to run a dev environment with emulators and be able to deploy the site to Firebase, install the Firebase CLI tool:
```
npm install -g firebase-tools
```

2. Make a duplicate copy of `.env.template` and rename it to `.env` (DO NOT DELETE `.env.template`).

3. Fill in the environment variables in `.env` with the ones from the project's Firebase credentials (can be found on the Firebase console -> Project Settings -> General -> scroll down to the bottom of the page to the "Your apps" section). Don't change the variable names inside `.env`, just copy the corresponding values over.

4. Test whether the website runs on your localhost by typing `npm start` into the command line while your working directory is set to the project folder.

## Notable Commands

| Command | Description |
| :------ | :---------- |
| npm run test:ci | runs a continuous integration-friendly test suite (currently, the main difference is that it skips end-to-end tests and exits upon completion). |
| npm run func | lints, compiles, and serves firebase functions inside the `functions` folder to `localhost:5051` (this is automatically ran by `npm start`). |


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
