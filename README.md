# pw-SauceDemo-test

[![Playwright Tests](https://github.com/InfoAdam1998/pw-SauceDemo-test/actions/workflows/playwright.yml/badge.svg)](https://github.com/InfoAdam1998/pw-SauceDemo-test/actions/workflows/playwright.yml)

End-to-end test automation for [SauceDemo](https://www.saucedemo.com/) (Swag Labs), built with **Playwright** and **TypeScript**. The suite covers authentication, a full purchase flow, inventory and cart behaviour, form validation, and data-driven testing across multiple user profiles — organised with the Page Object Model, custom fixtures, reusable authentication state, and continuous integration via GitHub Actions.

---

## What this project demonstrates

- **Page Object Model (POM)** — one page object per page, with private locators and behaviour-based methods.
- **Custom fixtures** — page objects and an authenticated session are injected into tests rather than constructed by hand.
- **Authentication reuse (`storageState`)** — the suite logs in once in a setup step and reuses the session, instead of driving the login UI in every test.
- **Data-driven testing** — a single test body is run across several user types via a loop, including an intentionally-failing case handled with `test.fail()`.
- **Stable, semantic locators** — uses SauceDemo's `data-test` attributes through `getByTestId`.
- **Secrets management** — credentials are read from environment variables (a git-ignored `.env` locally, GitHub Secrets in CI); no credentials are committed.
- **Cross-browser execution** — Chromium, Firefox, and WebKit.
- **Continuous Integration** — every push and pull request runs the full suite on GitHub Actions and publishes an HTML report.

---

## Tech stack

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- TypeScript
- [dotenv](https://www.npmjs.com/package/dotenv) for local environment variables
- GitHub Actions for CI

---

## Project structure

```
pw-SauceDemo-test/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI pipeline (runs on push / pull request)
├── fixtures/
│   └── test-options.ts           # custom fixtures: page objects + loggedInPage
├── pages/                        # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── auth.setup.ts             # logs in once, saves session to .auth/user.json
│   ├── login.spec.ts             # authentication (positive + negative cases)
│   ├── checkout.spec.ts          # full purchase / golden path
│   ├── inventory.spec.ts         # add/remove, cart, sorting
│   ├── checkout-validation.spec.ts  # required-field validation
│   └── data-driven.spec.ts       # same flow across multiple user types
├── utils/
│   └── parsers.ts                # shared helpers (e.g. price string → number)
├── playwright.config.ts          # baseURL, testIdAttribute, projects, setup dependency
├── .env                          # local credentials (git-ignored, not committed)
├── package.json
└── README.md
```

### Design notes

- **Page objects** own the locators and actions for a single page and expose behaviour (`login()`, `addItemToCart()`, `fillDetails()`) rather than raw elements. When the UI changes, the fix lives in one place.
- **Fixtures** (`fixtures/test-options.ts`) construct the page objects and provide a `loggedInPage` fixture that authenticates before a test runs, so specs request only what they need as arguments.
- **`utils/parsers.ts`** holds pure, page-independent logic (such as converting `"$29.99"` to `29.99`) shared between page objects.
- **Authentication** is centralised in `tests/auth.setup.ts`, which runs as a Playwright *setup project* dependency. It performs one real login and saves the browser session, which the standard-user specs then reuse via `storageState`. The `login` and `data-driven` specs deliberately opt out of the saved session — the first tests login itself, and the second needs to switch between different users.

---

## Test suites

| Spec | Coverage |
| --- | --- |
| `login.spec.ts` | Successful login plus negative cases: locked-out user, invalid password, and missing username / password, each asserting the specific error. |
| `checkout.spec.ts` | Full purchase: add item → cart → checkout → verify **item total + tax = total** (calculated, not hard-coded) → order confirmation. |
| `inventory.spec.ts` | Add/remove items with badge and button-state assertions, removing from inside the cart, and price/name **sort-order** verification (asserted against a correctly-sorted copy). |
| `checkout-validation.spec.ts` | Required-field validation for first name, last name, and postal code. |
| `data-driven.spec.ts` | Runs the price-sort flow across `standard_user`, `problem_user`, and `performance_glitch_user`. `problem_user`'s broken sorting is a **known defect**, marked with `test.fail()`. |

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- npm

### Installation

```bash
# clone the repository
git clone https://github.com/InfoAdam1998/pw-SauceDemo-test.git
cd pw-SauceDemo-test

# install dependencies
npm ci

# install the Playwright browsers
npx playwright install
```

### Environment variables

Create a `.env` file in the project root (this file is git-ignored and must **not** be committed):

```
STANDARD_USER=standard_user
PASSWORD=secret_sauce
LOCKED_OUT_USER=locked_out_user
```

> These are SauceDemo's public demo credentials. Using environment variables here mirrors real-world secret handling: the same test code reads from a local `.env` during development and from GitHub Secrets in CI.

---

## Running the tests

```bash
# run the whole suite (all browsers)
npx playwright test

# run against a single browser
npx playwright test --project=chromium

# run a single spec
npx playwright test login

# run in headed mode (watch the browser)
npx playwright test --headed

# open the last HTML report
npx playwright show-report
```

---

## Continuous Integration

The pipeline is defined in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) and runs on every push and pull request to `main` / `master`.

On each run it:

1. Checks out the code and sets up Node.js.
2. Installs dependencies (`npm ci`) and the Playwright browsers.
3. Runs the full suite across all configured browsers.
4. Uploads the HTML report as a build artifact (retained for 30 days).

Credentials are provided to CI through **GitHub repository secrets** (`Settings → Secrets and variables → Actions`), injected into the test step as environment variables. Because `.env` is git-ignored, no credentials ever reach the repository — the secrets are the CI equivalent of the local `.env` file.

Required secrets:

- `STANDARD_USER`
- `PASSWORD`
- `LOCKED_OUT_USER`

---

## License

[MIT](LICENSE) © Adam Blanza
