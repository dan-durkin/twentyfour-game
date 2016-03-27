TwentyFour.login = (function (){
	/***
	Private Variables
	***/
	var ref = TwentyFour.data.getRef();
	var logged_in = false;
	var authData;

	/***
	Private Methods
	***/

	ref.onAuth(function (data) {
		if (data) {
			logged_in = true;
			authData = data;
			populateData();
			console.log("User " + authData.uid + " is logged in with " + authData.provider);
		} else {
			if (logged_in) {
				logged_in = false;
				populateData();
			}
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
		var welcomeContainer = document.querySelector('.welcome-message')
		welcomeContainer.textContent = "";

		if(logged_in){
			var username = authData.facebook.displayName;
			var profPicUrl = authData.facebook.profileImageURL;

			var welcomeElement = "Welcome back, " + username + "!";
			welcomeContainer.textContent = welcomeElement;
			TwentyFour.display.loginDisplay(logged_in);
		} else {
			var welcomeElement = "Please log in";
			welcomeContainer.textContent = welcomeElement;
			TwentyFour.display.loginDisplay(logged_in);
		}
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
		location.reload();
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
		else{
			logged_in = false;
		}

		populateData();
	}

	return {
		config:config,
		facebookLogin:facebookLogin,
		logout:logout,
		getAuthData:getAuthData
	};
}());
