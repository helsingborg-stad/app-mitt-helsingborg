<!-- SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<p>
  <a href="https://github.com/helsingborg-stad/app-mitt-helsingborg">
    <img src="hbg-github-logo-combo.png" alt="Logo" width="300">
  </a>
</p>

[![Mitt Helsingborg banner][product-screenshot]](https://example.com)

<h3>Mitt Helsingborg</h3>

<p>
   App for Helsingborg E-services.
  <br />
  <a href="https://github.com/helsingborg-stad/app-mitt-helsingborg/issues">Report Bug</a>
  ·
  <a href="https://github.com/helsingborg-stad/app-mitt-helsingborg/issues">Request Feature</a>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About Mitt Helsingborg](#about-mitt-helsingborg)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Dependency versions](#dependency-versions)
  - [Installation](#installation)
- [Setup environment variables](#setup-environment-variables)
  - [Backend selector](#backend-selector)
    - [Component library (Storybook)](#component-library-storybook)
- [Deploy](#deploy)
  - [Android](#android)
    - [Add upload key](#add-upload-key)
    - [Generate AAB (Android App Bundle)](#generate-aab-android-app-bundle)
    - [Test the release build](#test-the-release-build)
    - [Upload AAB to Google Play Console](#upload-aab-to-google-play-console)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## About Mitt Helsingborg

### Built With

- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/package-manager/)
- [React Native Development Environment](https://reactnative.dev/docs/environment-setup/)
- [Eslint](https://helsingborg-stad.github.io/dev-guide/docs/development/linters/eslint.html)

### Dependency versions

Version of system tools and development dependencies such as Yarn, Ruby, and CocoaPods should be matched with the same versions as used by the CI-system.

For the full list of versions that are supported, see [MacOS 11 for iOS](https://github.com/actions/virtual-environments/blob/main/images/macos/macos-11-Readme.md) and [Ubuntu 20.04 for Android](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-Readme.md).

Versions locked/enforced by the repo are generally those used for iOS. If you encounter issues with deploying Android try using the versions listed in the link for Android instead.

### Installation

1. Clone the repo

```sh
git clone https://github.com/helsingborg-stad/app-mitt-helsingborg.git
```

2. Install packages

```sh
yarn install
```

3. Copy `.example.env` to `.env` and fill in the required variables.

4. Run app on iOS simulator

```sh
yarn ios
```

4. Run app on Android emulator

```sh
yarn android
```

## Setup environment variables

### Backend selector

Using the file `.env` in the root of the project, various parameters could be used to
change the behaviour of the app. One of these options is the possibility of building the
app with an interactive backend picker. This feature offers a dropdown available on the
login screen that allows the user to choose amongst a number of predefined backends in
order to troubleshoot or test.

To configure this feature, first put the app build into development mode by adding
the `APP_ENV` variable to the settings file. Like so:

```
APP_ENV=development
```

Next you need to specify the displayname of each backend with the `API_ENVS` parameter.
The below list offers four different targets that will be listed in the app in order of
appearance:

```
API_ENVS=SANDBOX,DEVELOP,RELEASE,PRODUCTION
```

NOTE that if the `APP_ENV` variable is set to production, only the first environment in
the `API_ENVS` list will be used and no picker will be available in the app.

For each backend, add two additional keys representing the URL and the APIkey of each:

```
{NAME}_MITTHELSINGBORG_IO=***
{NAME}_MITTHELSINGBORG_IO_APIKEY=***
```

For example:

```
SANDBOX_MITTHELSINGBORG_IO=***
SANDBOX_MITTHELSINGBORG_IO_APIKEY=***
```

#### Component library (Storybook)

1. Set env variabel IS_STORYBOOK to true in `.env`
2. Launch application in simulator by running command "yarn ios".
3. Now you should see storybook running in the simulator.

## Deploy

### Android

#### Add upload key

To be able to sign the app you need to add an upload key to the project.

1. Open **1Password** app and enter vault: **Mitt Helsingborg**.
2. Download `mitt-helsingborg-upload-key.keystore`.
3. Place the `mitt-helsingborg-upload-key.keystore` file under the `android/app` directory in your project folder.
4. Create a `keystore.properties` file:

```sh
cd android && cp example.keystore.properties keystore.properties
```

5. Update `keystore.properties` with passwords.

> **Important:** Make sure to never push mitt-helsingborg-upload-key.keystore or keystore.properties to Git.

#### Generate AAB (Android App Bundle)

1. Open `android/app/build.gradle`
2. Update **versionCode** by taking the latest published versionCode and increase it by 1. You can find previous uploaded versions at [Google Play Console](https://play.google.com/console).
3. Update **versionName**. This is displayed publicly when downloading the app.
4. Generate release AAB:

```sh
cd android
./gradlew bundleRelease
```

The generated AAB can be found under `android/app/build/outputs/bundle/release/app.aab`.

#### Test the release build

Before uploading the release build to the Play Store, make sure you test it thoroughly. First uninstall any previous version of the app you already have installed.

```sh
npx react-native run-android --variant=release
```

#### Upload AAB to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console) and navigate to the project app.
2. Click on **Production** in the menu.
3. Click **Create New Release** button and follow the instructions.

## Roadmap

See the [project backlog](https://sharing.clickup.com/b/h/6-61205386-2/41a54423aaa97af) for a complete list of upcoming features, known issues and releases.

## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the [MIT License][license-url].

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/helsingborg-stad/app-mitt-helsingborg.svg?style=flat-square
[contributors-url]: https://github.com/helsingborg-stad/app-mitt-helsingborg/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/helsingborg-stad/app-mitt-helsingborg.svg?style=flat-square
[forks-url]: https://github.com/helsingborg-stad/app-mitt-helsingborg/network/members
[stars-shield]: https://img.shields.io/github/stars/helsingborg-stad/app-mitt-helsingborg.svg?style=flat-square
[stars-url]: https://github.com/helsingborg-stad/app-mitt-helsingborg/stargazers
[issues-shield]: https://img.shields.io/github/issues/helsingborg-stad/app-mitt-helsingborg.svg?style=flat-square
[issues-url]: https://github.com/helsingborg-stad/app-mitt-helsingborg/issues
[license-shield]: https://img.shields.io/github/license/helsingborg-stad/app-mitt-helsingborg.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/helsingborg-stad/app-mitt-helsingborg/master/LICENSE
[product-screenshot]: hbg-github-banner.jpg
