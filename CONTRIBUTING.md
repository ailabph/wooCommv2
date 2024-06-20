# Contributing to INSERT_PROJECT_NAME_HERE

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to PROJECT_NAME and its packages. 
These guidelines follow in step with our Technical Maturity levels and as such this guide will evole over time as our maturity levels do as well.

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [Design Decisions](#design-decisions)
  * [Contributing In General](#contributing-in-general)
  * [Getting Started as a Developer](#getting-started-as-a-developer)
  * [Getting Started as a Tester](#getting-started-as-a-tester)
  * [Pull Requests](#pull-requests)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
 
[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [JavaScript Styleguide](#javascript-styleguide)
  * [Test Styleguide](#specs-styleguide)
  * [Documentation Styleguide](#documentation-styleguide)

[Security](#security)
[Load and Performance - LnP](#load-and-performance)
[Additional Notes](#additional-notes)

## Code of Conduct

This project and everyone participating in it is governed by the [PROJECT Code of Conduct](doc/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to management.

## What should I know before I get started?

### Design Decisions

Design decisions are made on a per customer project basis, and are lead by the Solution Architect in consultation with the senior engineers on the team at the time. All design decisions are documented in markdown in this repository! When we make a significant decision in how we maintain the project and what we can or cannot support, we will document it in an Architecture Decision Record - or ADR for short. ADRs can be found in the `./doc/adr` folder.

If you have a question around how we do things, check to see if it is documented. If it is *not* documented there, please ask your question in Slack and the Architect or a senior dev will answer.

### Contributing in General
In general, be mindful of and follow the [Way We Work](insert_link_here).
* Be mindful of the design decisions and dont go and ensure that any changes you make dont alter them - unless that is the point of the work you are doing.
* Be mindful of the tech stack and the underlying infrastructure that the project is built on - and again dont go adding to it or changing it  - unless that is what you have been tasked with doing. For exmaple don't introduce RabbitMQ if there is already SQS in place.
* If your User Story requires integration with new Cloud services, those new services should have already been documented by Project leadership and already be in place via IaC. If the services you need are not provisioned, you need to check in with the Architect and or the Dev Ops people on the project as something may have gone wrong in priortization. 

### Getting Started as a Developer.

Getting started
* Obviously you need to pull latest from main.
* TEMPLATE OVERRIDE: PRODVIDE SPECIFIC INSTRUCTIONS ON HOW A DEVELOPER CAN START WRITING CODE HERE.
* As a developer, don't forget your T1 tests.
* Commit often, and as we are running Trunk based development, make sure you have commited your code to a short lived feature bracnh as per our Source Code Maturity.

### Getting Started as a Tester.
* Like above, you will need to pull latest from main
* INSERT TEST CONTRIBUTING INFORMATION HERE.

### Pull Requests

The process described here has several goals:

- Maintain iRefers's quality
- Fix problems that are important to users
- Enable a sustainable system for the maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing. In general our status checks will include build, test, coverage and quality checks.<details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Refer to SCM02
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

### JavaScript Styleguide

All JavaScript code is linted with [Prettier](https://prettier.io/).

* Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
* Inline `export`s with expressions whenever possible
  ```js
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```
* Place requires in the following order:
    * Built in Node Modules (such as `path`)
    * Built in Atom and Electron Modules (such as `atom`, `remote`)
    * Local Modules (using relative paths)
* Place class properties in the following order:
    * Class methods and properties (methods starting with `static`)
    * Instance methods and properties
* [Avoid platform-dependent code](https://flight-manual.atom.io/hacking-atom/sections/cross-platform-compatibility/)

### Test Styleguide

- Include thoughtfully-worded, well-structured INSERT_TEST_FRAMEWORK_NAME_HERE specs in the `./test` folder.
- follow with simple requirements or instructions around our test requirements
- make reference to our TEST MATURITY and the type of tests we expect to see (T1/T2/Integration)
for example if we are using Jasmine:
- Include thoughtfully-worded, well-structured [Jasmine](https://jasmine.github.io/) specs in the `./test` folder.
- Treat `describe` as a noun or situation.
- Treat `it` as a statement about state or how an operation changes state.

#### Example

```coffee
describe 'a dog', ->
 it 'barks', ->
 # spec here
 describe 'when the dog is happy', ->
  it 'wags its tail', ->
  # spec here
```

### Documentation Styleguide

* Use [Markdown](https://www.markdownguide.org/getting-started/).
* This is another usefule [reference](https://experienceleague.adobe.com/docs/contributor/contributor-guide/writing-essentials/markdown.html?lang=en)
* Documentation should be stored in the `./doc` folder


## Security
INSERT Links to ABOUT SECUTIRY HERE.

## Load and Performance
INSERT Links related to LOAD AND PERFORMANCE TESTING HERE.

## Additional Notes
Anyother notes added here.