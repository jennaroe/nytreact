// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require('axios');


// Helper Functions (in this case the only one is runQuery)
var helpers = {

	// This function serves our purpose of running the query to geolocate. 
	runQuery: function(Topic, startYear, endYear){

		// Geocoder API
		var nytAPI = "a9dbcd162ca24daa9636b0ca4dd330bf";


		console.log(topic);

		//Figure out the geolocation
		var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + nytAPI + "&q=";
			queryURL += searchTopic;
			queryURL += "&begin_date=" + startYear + "0101";
			queryURL += "&end_date=" + endYear + "0101";


		return axios.get(queryURL)
			.then(function(queryData){

				console.log(response);

			var articles = queryData.data.response.docs;

			var articles_array = articles.map(function(article) {
					var articlesObj = {
						title: article.headline.main,
						pub_date: article.pub_date,
						url: article.web_url
					};
					return articlesObj;
				});

				// return the object to have access to it on the .then callback in the Search component
				return articles_obj_array;

		}); // end axios.get()
},

	// This function hits our own server to retrieve the record of query results
	getArticle: function(){

		return axios.get('/api')
			.then(function(response){

				console.log(response);
				return response;
			});
	},
	

	// This function posts new searches to our database.
	postArticle: function(postArticle){

		return axios.post('/api', postArticle)
			.then(function(results){

				console.log("Posted to MongoDB");
				return(results);
			})
	},


	// delete the article from the db
	deleteArticle: function(article_id) {
		
		return axios.post('/api/delete/', article_id)
			.then(function(response) {

				return response;

			}); // end axios.post()

	} // end deleteArticle()

}


// We export the helpers function 
module.exports = helpers;