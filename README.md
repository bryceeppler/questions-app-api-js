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
 `twilio phone-numbers:update "+15618234403" --sms-url="http://localhost:8000/api/v1/twilio/sms"`

TODO 
[] for some reason on the askQuestion corn funtion, i can't get it to ass to the sentMessages table
[] once I can get that working, we can set a schedule and populate the quesitons