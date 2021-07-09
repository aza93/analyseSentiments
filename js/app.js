// Module pour créer la connexion avec le cluster/localhost
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

const csvFilePath = '../python/data.csv'; // path du fichier csv à convertir
const csv = require('csvtojson'); // module utilisé pour

var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var options = {
  extras: {
    'vaccine': 5,
    'covid': 2
  }
};

csv({
  delimiter: ',',
	trim: false, // Désactivation de l'option de trim
	noheader: true, // Le fichier ne contient pas de header
  headers: ['date', 'description', 'username', 'location'], // Définition manuelle des headers
})
.fromFile(csvFilePath)
.then(tweets => {  
  const formattedTweets = tweets.map((tweet) => { // Je format le fichier en json
    return  {
      date: tweet['date'],
      description: tweet['description'],
      username: tweet['username'],
      location: tweet['location'],
      sentiment: sentiment.analyze(tweet['description'], options)
    }
  })


  console.log(formattedTweets);
  process.exit(1);
  

  // Je bulk mon fichier json
  formattedTweets.map((formattedTweet, index) => {
    //console.log('index = ', index)
    //console.log(formattedTweet);
    
    client.create({
      index: "groupe_5", // L'index le fichier
      type: "g5",
      id: index,
      body: formattedTweet
    }, function(error, response) {
      if (error) {
        console.error(error);
        return;
      }
      else {
        console.log(response); 
      }
    });
  })

}).catch(err => {
  console.log(err);
});