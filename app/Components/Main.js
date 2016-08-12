// Include React 
var React = require('react');

// Here we include all of the sub-components
var Form = require('./Children/Form.js');
var Results = require('./Children/Results.js');
var Saved = require('./Children/Saved.js');

// Helper Function
var helpers = require('./utils/helpers.js');

// This is the main component. 
var Main = React.createClass({

	// Here we set a generic state associated with the number of clicks
	getInitialState: function(){
		return {
			searchTerm: "",
			results: "",
			saved: [] /*Note how we added in this saved state variable*/
		}
	},	

	// This function allows childrens to update the parent.
	setTerm: function(term){
		this.setState({
			searchTerm: term
		})
	},

	// If the component changes (i.e. if a search is entered)... 
	componentDidUpdate: function(prevProps, prevState){

		if(prevState.searchTerm != this.state.searchTerm){
			console.log("UPDATED");

			// Run the query for the address
			helpers.runQuery(this.state.searchTerm)
				.then(function(data){
					if (data != this.state.results)
					{
						console.log("Results", data);

						this.setState({
							results: data
						})

						// After we've received the result... then post the search term to our Saved. 
						helpers.postSaved(this.state.searchTerm)
							.then(function(data){
								console.log("Updated!");

								// After we've done the post... then get the updated saved
								helpers.getSaved()
									.then(function(response){
										console.log("Current Saved", response.data);
										if (response != this.state.saved){
											console.log ("Saved", response.data);

											this.setState({
												saved: response.data
											})
										}
									}.bind(this))	
							}.bind(this)
						)
					}
				}.bind(this))
				
			}
	},

	// The moment the page renders get the Saved
	componentDidMount: function(){

		// Get the latest saved.
		helpers.getSaved()
			.then(function(response){
				if (response != this.state.saved){
					console.log ("Saved", response.data);

					this.setState({
						saved: response.data
					})
				}
			}.bind(this))
	},

	// Here we render the function
	render: function(){

		return(

			<div className="container">

				<div className="row">

					<div className="jumbotron">
						<h2 className="text-center">New York Times Article Scrubber</h2>
						<p className="text-center"><em>Search for and Annotate Articles of Interests!</em></p>
					</div>

					<div className="col-md-12">
					
						<Form setTerm={this.setTerm}/>

					</div>

					<div className="col-md-12">
				
						<Results results={this.state.results} />

					</div>

				</div>

				<div className="row">

					<Saved saved={this.state.saved}/> 

				</div>

			</div>
		)
	}
});

// Export the component back for use in other files
module.exports = Main;