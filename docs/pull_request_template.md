This line can be removed: Read this short article before you start writing https://www.pullrequest.com/blog/writing-a-great-pull-request-description/

## Explain the changes you’ve made

Good example:
I've added support for authentication to implement Key Result 2 of OKR1. It includes
model, table, controller and test. For more background, see #CLICKUP-ID.

## Explain why these changes are made

A good example:
These changes complete the user login and account creation experience. See #CLICKUP_ID for more information.

## Explain your solution

A Good example:
This includes a migration, model and controller for user authentication.
I'm using Devise to do the heavy lifting. I ran Devise migrations and those are included here.

## How to test

Concrete example:

1. Checkout this branch
2. Swap the application to run storybook
3. Fire upp the simulator by running the command `yarn ios`
4. ...etc.

## Tested environments

- [] Storybook on a iOS device/simulator.
- [] Building the Application on a iOS device/simulator.
- [] Building the Application on a Android device/simulator.

## Screenshots

(Optional)

Screenshots are helpful for UI-related changes. It could be an before and after change as an example.
Even backend code can benefit from a screenshot of the net change.

## Other notes

(Optional)

A good example:
Let's consider using a 3rd party authentication provider for this, to offload MFA and other considerations as they arise and as the privacy landscape evolves.
AWS Cognito is a good option, so is Firebase. I'm happy to start researching this path. Let's also consider breaking this out into its own service.
We can then re-use it or share the accounts with other apps in the future.

---

## Checklist for reviewers

Here are a few points that are useful for reviewers to check.

The short list of the (maybe) most important points are:

- Does this PR work as expected?
- Does the PR properly only concern a single feature/bug/thing?
- Is the code clear and concise?
- Will the changes impact existing functionality?
- Are there any linting errors (ESLint) that should be resolved?
- Do the automatic GitHub checks pass?

However it is good if a reviewer can be as thorough as possible,
within reasonable limits of course.

### Functionality

- Does this PR work as expected?
- If this is a new feature, does it add value, or is it a sign of feature-creep?
- Will the changes impact existing functionality?
- Does the changes create inconsistencies somewhere else?
- Does the code work on different platforms if applicable?
- How does the code handle if unexpected values are passed to functions etc.?

### Readability, syntax, formatting, style

- Is the code clear and concise?
- Has styling rules (Prettier) been applied to included files?
- Are functions/variables/etc. aptly named?

### Design

- Is the code properly planned and designed?
- Is code organized/separated in a logical fashion?
- Does the code follow clean code practices to a reasonable degree?
- Is the code self-documenting enough?
- Is the code in sync with existing patterns/technologies?
- Does the code reuse existing functionality where applicable?
- Is the code designed with reusability in mind?
- Does the code have hard-coded values that can be refactored?

### Patterns, idioms, tests, best practices

- Are there any linting errors (ESLint) that should be resolved?
- Is the code properly typed (TypeScript)?
- Does the code utilize language features to their full potential?

### Debugging, testing, configuring

- Is appropriate logging used?
- Have tests been added/modified to accommodate the changes?
- Is the feature sufficiently configurable in case tweaks are required in the future?

### Performance, reliability, scalability

- Is the code well optimized?
- Does the code scale?
- Does the code handle failure scenarios?

### Security

- Is there any obvious potential for exploits and security threats?
- Does code check proper authorization where applicable?

### Etiquettes

- Are commits atomic (does only one thing per commit)?
- Does the PR properly only concern a single feature/bug/thing?
- Are commit messages well-written?
- Do the automatic GitHub checks pass?
