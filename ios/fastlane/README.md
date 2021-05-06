fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### print_changelog
```
fastlane print_changelog
```
Print the changelog

----

## iOS
### ios update_app_version_numbers
```
fastlane ios update_app_version_numbers
```
Update app version number and build number based on branch name following semantic versioning (falls back to highest of latest testflight vs xcode project version)
### ios build
```
fastlane ios build
```
Build the app with correct distribution signing
### ios beta
```
fastlane ios beta
```
Push a new beta build to TestFlight

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
