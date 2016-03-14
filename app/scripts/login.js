TwentyFour.login = (function (){
	/***
	Private Variables
	***/
	var ref = TwentyFour.data.getRef();
	var logged_in = false;
	var authData;
	
	/*
	var uid = data.uid;
	var username = data.facebook.displayName;
	var profPicUrl = data.facebook.profileImageURL;
	*/
	
	/***
	Private Methods
	***/
	
	ref.onAuth(function (data) {
		if (data) {
			authData = data;
			populateData();
			console.log("User " + authData.uid + " is logged in with " + authData.provider);
		} else {
			if (logged_in) {
				// however you want to handle a log out
			}
			
			logged_in = false;
		}
	});
	
	function authHandler(error, data) {
		if (error) {
			console.log("Login Failed!", error);
		} else {
			localStorage.setItem("user", JSON.stringify(data));
			logged_in = true;
			authData = data;
			console.log("Authenticated successfully with payload:", authData);
		}
	}
	
	function populateData(){
		var username = authData.facebook.displayName;
		var profPicUrl = authData.facebook.profileImageURL;
		
		var welcomeContainer = $('.welcome');
		welcomeContainer.empty();
		
		var welcomeElement = $("<p>Welcome back, " + username + "!</p>");
		welcomeContainer.append(welcomeElement);
	}
	
	/***
	Public Methods
	***/
	
	function getAuthData () {
		return authData;
	}
	
	function facebookLogin () {
		ref.authWithOAuthPopup("facebook", authHandler,{
		  remember: "sessionOnly",
		  scope: "public_profile"
		});
	}
	
	function logout () {
		ref.unauth();
	}
	
	function config (){
		if(localStorage.getItem("user")){
			var user = JSON.parse(localStorage.getItem("user"));
			var expiration = new Date(user.expires * 1000).getTime() - new Date().getTime()
			
			if(expiration <= 0 ){
				localStorage.clear();
				logout();
				logged_in = false;
			} else{
				if(authData){
					logged_in = true;
					populateData();
				}
			}
		}
	}

	return {
		config:config,
		facebookLogin:facebookLogin,
		logout:logout,
		getAuthData:getAuthData
	};
}());

	/***
	create config function to run on setup
	check localstorage on page load
	
	new Date(user.expires * 1000).getTime() - new Date().getTime() <= 0
false

	// On Page Load
	// 1. Pull in data from localStorage -- localStorage.getItem("whateverYoUCallthis") / localStorage.setItem("whatever", value)
	// Note: value has to be a string (JSON.stringify(value))
	// Note: JSON.parse to turn it into an object.  Check to make sure that it actually has a value before you try to JSON.parse
	// 2. Check expiration of authData.expires
	// 3. If it is expired, clear localStorage, keep logged_in as false
	// 4. If it is not expired
	// 4a. Make sure that authData variable has been set
	// 4b. Set logged_in = true
	// 4c. Call a function to render the user's information
	
	// If they are not logged in and they click the auth button:
	// 1. Execute oAuthPopup
	// 2. On success, set authData variable
	// 3. Set logged_in = true
	// 4. Set localStorage
	// 5. Call a function to render the user's information
***/