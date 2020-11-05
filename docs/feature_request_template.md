This line can be removed: Read this short article before you start writing https://www.pullrequest.com/blog/writing-a-great-pull-request-description/


## Explain the changes you’ve made

Good example:
I've added support for authentication to implement Key Result 2 of OKR1. It includes 
model, table, controller and test. For more background, see #CLICKUP-ID.
Include 

## Explain why these changes are made

A good example:
These changes complete the user login and account creation experience. See #CLICKUP_ID for more information.

## Explain your solution

A Good example:
This includes a migration, model and controller for user authentication. 
I'm using Devise to do the heavy lifting. I ran Devise migrations and those are included here.

## How to test the changes?

Concrete example:
1. Checkout this branch
2. Swap the application to run storybook
3. Fire upp the simulator by running the command`yarn ios`
4. ...etc

## Was this feature tested in the following environments?
- [] Storybook on a iOS device/simulator.
- [] Building the Application on a iOS device/simulator.
- [] Building the Application on a Android device/simulator.

## Screenshots (optional)
Screenshots are helpful for UI-related changes. It could be an before and after change as an example.
Even backend code can benefit from a screenshot of the net change.

## Anyhting else? (optional)

A good example:
Let's consider using a 3rd party authentication provider for this, to offload MFA and other considerations as they arise and as the privacy landscape evolves. 
AWS Cognito is a good option, so is Firebase. I'm happy to start researching this path. Let's also consider breaking this out into its own service. 
We can then re-use it or share the accounts with other apps in the future.
