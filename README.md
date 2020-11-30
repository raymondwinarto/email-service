# Email Service

## About

This Email Service provides an abstractioni between two different email service providers (SendGrid and MailGun). When the current active provider goes down, this Email Service will quickly failover to the second provider.

## Service Features and Limitations

- Support multiple email recipients, CCs, and/or BCCs.
- Support plain text only (HTML is not currently supported).
- No API authentication is implemented (API is unsecured).
- Swagger documentation is available from `/documentation` route on non `prod` environment.

## Heroku App

- Endpoint: https://shielded-thicket-89980.herokuapp.com/mails
- Documentation: https://shielded-thicket-89980.herokuapp.com/documentation

* Environment level: `staging`
* The API can be tested directly via Swagger.
* or use the following sample curl that can be imported into Postman
  ```
  curl -X POST "https://shielded-thicket-89980.herokuapp.com/mails" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{ \"tos\": [ \"email1@example.com\" ], \"subject\": \"RE: Your Loan Application\", \"content\": \"Dear Sir, Your loan is conditionally approved. Regards, John Smith\"}"
  ```
* **Note:**
  - On application start `SendGrid` will be set as the primary/default.
  - With `SendGrid`, when sending emails to `gmail` or `yahoo`, emails were successfully delivered although sometimes they can be in Junk Mail folder, however, `hotmail` rejected the email altogether (marked as Blocked).
  - To test `MailGun` on this Heroku app, please let me know - I will need to make `SendGrid` API_KEY invalid.
  - `MailGun` also requires me to add recipients email addresses to Authorised recipients - so please let me know which email addresses to be whitelisted - if this is required.

## Install and Run Locally

- Clone repository (assuming Git is already installed on the machine).
- Run `npm install` (assuming Node and NPM are already installed on the machine).
- To run application for development - run `npm run dev`
- Local endpoint: http://localhost:3080/mails
- Swagger: http://localhost:3080/documentation
