# Technologies

- morgan - for logging
- prisma - for ORM and database management/migrations
- postgres for a relational database
- dotenv for managing variables in dev and productions
- jsonwebtokens for auth
- validator for validating data before database entry
- bcrypt for hashing passwords

- twilio for sms messaging
 - command for twilio localhost 
 `twilio phone-numbers:update "+15618234403" --sms-url="https://questions-app-api-production.up.railway.app/api/v1/twilio/sms"`

TODO 
[x]  cron askQuestion function does not add an entry to the SentMessage table 
    [x] add test function for testing/refactoring
    [x]  fix message deployment/SentMessage tracking
    [x]  integrate with the cron function


[x]  setup cron askQuestion to pick from a specific question set
[x]  allow for a second questionSet and second cron schedule
[]  deploy cron server as it's own instance?
[]  UI fixes
[]  deploy

