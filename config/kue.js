// for putting all emails/jobs to be sent in a queue
const kue = require('kue');
const queue = kue.createQueue({
    // prefix: 'q',
    redis: {
        // open ubuntu app , redis-cli is installed as kue runs on it
        // type redis-server to switch on server 
        // check the port num & mention here to connect
      port: 6379,
    }
  });

module.exports = queue;

/* to see all mails status - active , inactive,complete :--
   open a new terminal , in ur folder
   type cmnd ->  node ./node_modules/kue/bin/kue-dashboard
   it would run file kue-dashboard & is available on localhost:3000
   Open localhost:3000 , to see the results
*/