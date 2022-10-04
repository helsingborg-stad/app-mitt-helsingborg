fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### print_changelog

```sh
[bundle exec] fastlane print_changelog
```

Print the changelog

### print_changelog_github

```sh
[bundle exec] fastlane print_changelog_github
```

Print the changelog with a GitHub link to changes

### tag_version

```sh
[bundle exec] fastlane tag_version
```

Tag the current ref with the version based on branch name or env input

----


## iOS

### ios build_adhoc

```sh
[bundle exec] fastlane ios build_adhoc
```

Build an ad-hoc ipa

### ios build

```sh
[bundle exec] fastlane ios build
```

Build and upload to Testflight

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
