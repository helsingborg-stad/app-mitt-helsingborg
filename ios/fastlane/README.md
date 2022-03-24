fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### tag_version

```sh
[bundle exec] fastlane tag_version
```

Tag the current ref with the version based on branch name or env input

### print_changelog

```sh
[bundle exec] fastlane print_changelog
```

Print the changelog

----


## iOS

### ios build_adhoc

```sh
[bundle exec] fastlane ios build_adhoc
```

Build an ad-hoc ipa

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Push a new beta build to TestFlight

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
