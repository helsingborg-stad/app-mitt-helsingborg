# Build Strategy

## iOS

There are three main ways to build Mitt Helsingborg:

1. Manual deployment with Xcode (good for one-off testing)
2. Semi-automatic deployment with Fastlane
3. Automatic CI deployment with GitHub Actions (recommended for most builds)

There are several parts to an iOS build that can be hard to wrap your head around. Here are the relevant bits:

| Name                                | Description                                                                                                                                                                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apple Developer Portal              | Web portal where you manage certificates, identifiers, developer devices, and provisioning profiles. https://developer.apple.com/account/#/overview/.                                                                                                                                    |
| App Store Connect API Key           | This is used by Fastlane in place of an Apple Developer Account to perform actions such as uploading builds. Managed at https://appstoreconnect.apple.com/access/api.                                                                                                                    |
| App Store Connect                   | Web portal where you manage app-specific details (builds, TestFlight, App Store page info). https://appstoreconnect.apple.com/.                                                                                                                                                          |
| Bundle ID / App ID / App Identifier | Unique identifier for the app. In this case `works.hbg.MittHelsingborg`.                                                                                                                                                                                                                 |
| CocoaPods / Pods                    | Dependency management system for native iOS libraries.                                                                                                                                                                                                                                   |
| Fastlane                            | Build system. Uses simply ruby code/configs to abstract away much of the build process (like handling certs etc.).                                                                                                                                                                       |
| Fastlane lane                       | A developer-configured code path that can be executed (e.g. "build adhoc" or "build and upload to App Store").                                                                                                                                                                           |
| GitHub Actions                      | CI (Continuous Integration) system. Uses yaml to config commands to run on certain triggers (such as pull requests). Can also be executed manually (such as building and uploading to App Store).                                                                                        |
| GitHub Actions runner               | The system that runs a workflow/job. In practice this is (probably) a virtual machine running in the cloud.                                                                                                                                                                              |
| GitHub Actions artifacts            | Developer-defined files that are saved after a workflow is done. Can be accessed by clicking the workflow run in the [Actions tab](https://github.com/helsingborg-stad/app-mitt-helsingborg/actions).                                                                                    |
| Provisioning Profile                | File that controls which devices are allowed to install the build. Profiles are automatically downloaded by Xcode/Fastlane, as long as you have access to the Team.                                                                                                                      |
| Signing Certificate                 | Used to sign builds with. Certificate content is usually password-protected. For local builds this should be imported to your Keychain. For CI builds this is provided in base64 as an env variable. There is a limit to how many distribution (production) certificates that can exist. |
| Team                                | Developer group. In this case Helsingborgs Stad.                                                                                                                                                                                                                                         |
| Team ID                             | Unique identifier for your team. Something like `ABCDE1FGH2`.                                                                                                                                                                                                                            |
| Xcode                               | Default IDE for Mac.                                                                                                                                                                                                                                                                     |
| Xcode Command Line Tools            | Extra programs required for Fastlane.                                                                                                                                                                                                                                                    |
| `.xcodeproj` / Xcode Project        | Project main file for a specific unit (e.g. the app itself).                                                                                                                                                                                                                             |
| `.xcodeworkspace` / Xcode Workspace | A collection of projects unified. This is generally what you should open/work with in Xcode.                                                                                                                                                                                             |

### Manual

Mitt Helsingborg currently supports Xcode 12.4 (same as CI system) and 12.5.

Building manually with Xcode is good for one-off local builds and for emergencies when automatic deployment does not work. To begin open
[MittHelsingborg.xcworkspace](../ios/MittHelsingborg.xcworkspace) in Xcode (note that there is an additional workspace file which should not be used).

To be able to properly build:

- You have to be signed into your Apple Developer Account, and that account has to be part of the Team.
- Automatic Signing should be off (if not already) and the relevant provisioning profile should be selected for the "MittHelsingborg" target in the "Mitt Helsingborg" project.
  - Note: for the privisioning profile to appear you might have to download the profiles first from Xcode -> Preferences -> Accounts.
- You need to have a valid certificate imported into your Keychain (get this certificate from an Admin or Team member with access).

Sometimes Pods are not properly detected; try following the steps outlined [in the Troubleshooting section](#pods--node-modules) below in that case.

### Local Fastlane

> [Click here for Fastlane documentation](https://docs.fastlane.tools/actions/)

> There is an [auto-generated README.md file for Fastlane](../ios/fastlane/README.md) which may provide extra info for this project

Fastlane is a build system that alleviates much of the platform-specific processes required to build. The current Fastlane lanes
(defined [in Fastfile](../ios/fastlane/Fastfile)) automatically handles downloading and setting correct certificates and profiles,
updated app version numbers based on previous App Store Connect builds, building, uploading, and setting a (minimal) changelog for TestFlight.

To run Fastlane locally you need an installation of Ruby matching the [project version](../.ruby-version), as well as
Xcode Command Line Tools installed.

You also need to install Fastlane itself. It is recommended to do this via the [Gemfile](../Gemfile) with [Bundler](https://bundler.io/) however
this is not required; just make sure to install either the version specified in the Gemfile, or following the [instructions for versions](#versions) below.

Finally, you have to create and populate a `ios/fastlane/.env` file. Full instructions (and pre-populated values) are available
in [the example.env file](../ios/fastlane/example.env).

To run, make sure you're in the `ios` directory, then run either `fastlane ios build_adhoc` (to build an AdHoc .ipa file) or `fastlane ios beta` (to build
and upload a production build to App Store).

### GitHub Actions / CI

The relevant workflow files are [ios-build.yml](../.github/workflows/ios-build.yml) and
[ios-build-adhoc.yml](../.github/workflows/ios-build-adhoc.yml).

A workflow represents a set of steps
(e.g. build and upload) taken upon a given trigger/triggers (e.g. pull request or manual trigger).

To run a workflow manually (requires certain repository permissions), navigate to the
[Actions tab](https://github.com/helsingborg-stad/app-mitt-helsingborg/actions), click a workflow, select "Run workflow", and choose
a branch to run the workflow on. If everything is setup correctly, a workflow is queued and processed in the cloud.

For `iOS - Build` a new build is automatically uploaded to TestFlight. If you're part of the App Store Connect "CD Builds" group or an
internal tester you should get a TestFlight notification when the build is ready.

For `iOS - Build (Ad Hoc)` an .ipa file is produced as part of the build artifacts. This is less useful, but can be used for debugging in certain cases.
Build artifacts can be accessed from the summary for the workflow run in the [Actions tab](https://github.com/helsingborg-stad/app-mitt-helsingborg/actions).

In addition to running manually, **release** and **production** builds are automatically triggered on merges onto `release/*` and `master` branches respectively.

> [Click here for GitHub Actions Workflow documentation](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

Most configuration is provided to the workflow from an GitHub Actions environment. There is currently only one GitHub environment but it's used for all three
(development, release, production) app environments. The following variables are needed
([set here](https://github.com/helsingborg-stad/app-mitt-helsingborg/settings/environments/)):

- APP_IDENTIFIER
- APP_STORE_CONNECT_API_KEY_ISSUER_ID
- APP_STORE_CONNECT_API_KEY_KEY_ID
- BUILD_CERTIFICATE_BASE64
- CERT_KEYCHAIN_PASSWORD
- CONNECT_API_KEY_CONTENT
- DEVELOP_DOTENV_CONTENTS_BASE64
- GYM_SCHEME
- MAIN_PROJECT
- MAIN_WORKSPACE
- P12_PASSWORD
- PERFORM_LONG_UPLOAD
- PODS_DD_PREFIX
- PRODUCTION_DOTENV_CONTENTS_BASE64
- RELEASE_DOTENV_CONTENTS_BASE64
- TEAM_ID

For variables shared with [Fastlane](#local-fastlane) the values are the same. The additional variables are:

| Name                                                                                                      | Description                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BUILD_CERTIFICATE_BASE64`                                                                                | Base64-encoded contents of production certificate .p12 file ([more info](https://docs.github.com/en/actions/guides/installing-an-apple-certificate-on-macos-runners-for-xcode-development)).                                                        |
| `CERT_KEYCHAIN_PASSWORD`                                                                                  | Password used by the build workflow when generating a temporary keychain. In theory this doesn't matter too much, however it's good practice to have this be fairly secure, as there's always the off-chance that data can leak on a GitHub runner. |
| `P12_PASSWORD`                                                                                            | Password to decode `BUILD_CERTIFICATE_BASE64` with.                                                                                                                                                                                                 |
| `PODS_DD_PREFIX`                                                                                          | Optional. Used to force a rebuild of the pods, in case the pod cache is not working properly. Doesn't matter what this is, but it's good practice to set it to the current timestamp when changing, to avoid conflicts with old caches.             |
| `DEVELOP_DOTENV_CONTENTS_BASE64` / `RELEASE_DOTENV_CONTENTS_BASE64` / `PRODUCTION_DOTENV_CONTENTS_BASE64` | Base64-encoded data which will be decoded and put into .env at root for the respective environment. This contains the same content as you would usually have in a `.env` file at your project root.                                                 |

### Troubleshooting

#### Versions

In general, the supported versions of programs (such as Ruby and Fastlane) are the ones pre-installed on the GitHub MacOS image used (which are
outlined [here](https://github.com/actions/virtual-environments/blob/main/images/macos/macos-10.15-Readme.md)).

#### Build Hierarchy

For troubleshooting local builds on your own system, try performing these different types of builds in order,
as they're roughly dependent on each other and if one step fails the next are very likely to also fail:

1. `yarn ios` build (regular React Native run)
2. Xcode build
3. `fastlane build_adhoc` build

#### Pods / Node Modules

It is generally a good idea to remove `node_modules` and `ios/Pods`, followed by `yarn install` and `cd ios; pod install` to start clean if encountering
dependency-related issues.
Pods are known to cause issues sometimes, especially after pulling in a lot of changes. Installed Pods are based on `node_modules` content for native
plugins, hence why the two are related.

#### GitHub Actions

Logs for all workflow runs are available [under the Actions tab](https://github.com/helsingborg-stad/app-mitt-helsingborg/actions). Click on a workflow run
followed by the job name to access the full console log output.

Xcode output is supressed (because of the high amounts of warnings) and instead provided as a build artifact after the workflow is done.

Note that all logs are publically available; take note not to leak sensitive information if debugging.
