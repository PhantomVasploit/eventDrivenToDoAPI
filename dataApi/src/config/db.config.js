const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URI, {useUnifiedTopology: true});

mongoose.connection.once('open', ()=>{
  console.log(`Database server connected.`);
}).on('error', (error)=>{
  console.log(`Error connecting to database server: ${error.message}`);
})
