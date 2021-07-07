// Module pour créer la connexion avec le cluster/localhost
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

const csvFilePath = 'Data.csv'; // path du fichier csv à convertir
const csv = require('csvtojson'); // module utilisé pour

csv({
  delimiter: ';',
	trim: false, // Désactivation de l'option de trim
	noheader: true, // Le fichier ne contient pas de header
  headers: ['title', 'seo_title', 'url', 'author', 'date', 'category', 'locales', 'content'], // Définition manuelle des headers
})
.fromFile(csvFilePath)
.then(blogs => {  
  const formattedBlogs = blogs.map((blog) => { // Je format le fichier en json
    return  {
      title: blog['title'],
      seo_title: blog['seo_title'],
      url: blog['url'],
      author: blog['author'],
      date: blog['date'],
      category: blog['category'],
      locales: blog['locales'],
      content: blog['content']
    }
  })

  // Je bulk mon fichier json
  formattedBlogs.map((formattedBlog, index) => {
    //console.log('index = ', index)
    //console.log(formattedBlog);
    
    client.create({
      index: "groupe_8", // L'index le fichier
      type: "g8",
      id: index,
      body: formattedBlog
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