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

# Table of Contents

- [Table of Contents](#table-of-contents)
- [About Mitt Helsingborg](#about-mitt-helsingborg)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
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
- [CI / Automated Builds](#ci--automated-builds)
  - [General](#general)
  - [iOS build (TestFlight)](#ios-build-testflight)
    - [Environment variables (secrets)](#environment-variables-secrets)
  - [Other workflows](#other-workflows)
- [Sentry](#sentry)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

# About Mitt Helsingborg

Mitt Helsingborg is an iOS and Android app used by citizens in Helsingborg, Sweden. This app allow citizens to interact with various Helsingborg E-services.

The app is built with [React Native](https://reactnative.dev/) using [TypeScript](https://www.typescriptlang.org/). Other tech choices includes:

- [StoryBook](https://storybook.js.org/) for component stories
- [Styled Components](https://styled-components.com/) for styling elements
- [Eslint](https://helsingborg-stad.github.io/dev-guide/docs/development/linters/eslint.html) for linting
- [Prettier](https://prettier.io/) for formatting

# Getting Started

To get a local copy up and running follow these simple steps.

## Prerequisites

Note: in general the supported version of any given dependency is the same as the version used by the CI.

- [Node.js](https://nodejs.org/en/download/package-manager/) - the version(s) supported are noted in the [engines section of package.json](package.json)
- [Yarn](https://yarnpkg.com/)
- [React Native Development Environment](https://reactnative.dev/docs/environment-setup/)

## Installation

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

The app uses dotenv (`.env`) files to read environment variables during build-time.
Copy `example.env` to `.env` replace the values to get started.

### Backend selector

Set `MITTHELSINGBORG_IO` to an MH-compatible url (see [helsingborg-io-sls-api](https://github.com/helsingborg-stad/helsingborg-io-sls-api)) and
set `MITTHELSINGBORG_IO_APIKEY` to the API key required to authorize against it. This will be used as the default environment when using the app.

After starting the app, at the Login Screen, you can optionally provide additional environment(s) to override the default environment.
To do so click the gear icon in the top-right corner and enter a value for the "App Konfiguration".

The format of the configuration is:

```json
{ "envName": ["apiUrl", "apiKey"] }
```

For example, to provide two environments, `develop` and `release`, enter:

```json
{
  "develop": ["https://myapi.com/dev", "123"],
  "release": ["https://myapi.com/release", "abc"]
}
```

If multiple endpoints are specified like the example, a dropdown-picker will be shown on the Login Screen
where you can choose which environment to use.

If only one environment is specified then it will be used instead of the default environment specified in the `.env` file.

### Component library (Storybook)

1. Set env variabel `IS_STORYBOOK` to true in `.env`
2. Launch application in simulator by running command "yarn ios".
3. Now you should see storybook running in the simulator.

# Deploy

## Android

### Add upload key

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

### Generate AAB (Android App Bundle)

1. Open `android/app/build.gradle`
2. Update **versionCode** by taking the latest published versionCode and increase it by 1. You can find previous uploaded versions at [Google Play Console](https://play.google.com/console).
3. Update **versionName**. This is displayed publicly when downloading the app.
4. Generate release AAB:

```sh
cd android
./gradlew bundleRelease
```

The generated AAB can be found under `android/app/build/outputs/bundle/release/app.aab`.

### Test the release build

Before uploading the release build to the Play Store, make sure you test it thoroughly. First uninstall any previous version of the app you already have installed.

```sh
npx react-native run-android --variant=release
```

### Upload AAB to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console) and navigate to the project app.
2. Click on **Production** in the menu.
3. Click **Create New Release** button and follow the instructions.

# CI / Automated Builds

This project uses GitHub actions in combination with Fastlane to automatically build and upload builds (currently iOS only).

## General

A distinct process (e.g. "build an iOS app") is denoted as a "workflow". Each workflow is a separate yaml file in `.github/workflows`. Most workflows can be manually run from the [actions tab](https://github.com/helsingborg-stad/app-mitt-helsingborg/actions) if you have access. Previous workflow runs with logs and artifacts can also be found there.

Configuration (environment variables) are provided through [GitHub secrets](https://github.com/helsingborg-stad/app-mitt-helsingborg/settings/secrets/actions).

Many operation are done with Fastlane. Fastlane is a tool used to simplify many actions (such as handling certificates and profiles, creating and uploading builds, etc.).
Fastlane is used through ruby files that are run in a Fastlane context with `fastlane run <lane>`. A lane is a single contained process, such as creating and uploading a build.

## iOS build (TestFlight)

The workflow file for iOS builds is `./github/workflows/ios-build.yml`. It can be run manually, and runs automatically for any push to branches
matching `release/**` (e.g. `release/1.4.0`). It automatically tries to determine the version and build number to set based on the branch name,
and defaults to incrementing the latest from TestFlight.

Version number and build number can optionally be forced for manual runs.

The workflow sets up dependencies and variables and then calls a specific Fastlane lane defined in `ios/fastlane/Fastfile`.

### Environment variables (secrets)

Variables used by the workflow and Fastlane are documented [in the Fastlane example.env](ios/fastlane/example.env). The other variables used by the build workflow are:

| Variable                          | Contents                                                                                                                                                                                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| BUILD_CERTIFICATE_BASE64          | Base64 representation of the Apple distribution certificate `.p12` file. Generate with `cat cert.p12 \| base64`.                                                                                                                       |
| CACHE_KEY_PREFIX                  | Used to change the id for the caching of node modules and cocoapods. Changing this will essentially invalidate the cache. The actual value is not important but it's a good praxis to use the current date, to avoid future conflicts. |
| CERT_KEYCHAIN_PASSWORD            | Password used for the ephemeral keychain used to store the certificate. This variable is mostly unimportant as the keychain is not persistent.                                                                                         |     |
| DEVELOP_DOTENV_CONTENTS_BASE64    | Contents of the `.env` file used for development builds. See [example.env](.example.env). Generate with `cat .env \| base64`.                                                                                                          |
| P12_PASSWORD                      | Password to unlock the contents of `BUILD_CERTIFICATE_BASE64` (the password entered during the certificate export).                                                                                                                    |
| PRODUCTION_DOTENV_CONTENTS_BASE64 | Contents of the `.env` file used for production builds. See [example.env](.example.env). Generate with `cat .env \| base64`.                                                                                                           |

- BUILD_CERTIFICATE_BASE64
- CACHE_KEY_PREFIX
- CERT_KEYCHAIN_PASSWORD
- DEVELOP_DOTENV_CONTENTS_BASE64
- P12_PASSWORD
- PRODUCTION_DOTENV_CONTENTS_BASE64

### Production build

An iOS production can be done by manually running the build workflow using a release branch and settings the "forced environment" to `production`.

## Other workflows

In addition to builds there the following workflows:

- `automated-tests.yml` - runs `yarn test` for pull requests
- `styling-linting.yml` - checks styling consistency and linting errors for pull requests
- `tag-master.yml` - can be used to tag a branch based on the name of a ref (e.g. `release/1.4.0` => `1.4.0`)

# Sentry

Sentry is used for live error reporting in deployed builds. To use Sentry add your Sentry DSN as an environment variable:

```bash
SENTRY_DSN=https://1234@sentry.mydomain.se/0
```

Additionally, to get correct symbols and sourcemaps for release builds add a file called `android/sentry.properties` or `ios/sentry.properties` and add your credentials:

```bash
defaults.url=https://sentry.mydomain.se/
defaults.org=sentry
defaults.project=my-sentry-project
auth.token=my-auth-token
```

These files can be automatically generated by running the Sentry Wizard:

```bash
npx @sentry/wizard -i reactNative -p ios android -u https://sentry.mydomain.se/
```

# Roadmap

See the [project backlog](https://sharing.clickup.com/b/h/6-61205386-2/41a54423aaa97af) for a complete list of upcoming features, known issues and releases.

# Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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
