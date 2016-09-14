// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','todoApp.services'  ])
.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
 
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
})

.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (toState.data.authenticate && !Parse.User.current()) {
          // User isn’t authenticated
          $state.transitionTo("login");
          event.preventDefault(); 
        }
  });
})
 
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('root', {
            url: '',
            controller: 'rootCtrl',
            data: { 
                authenticate: false
            }
        })
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl',
            data: {
               authenticate: true
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl',
            data: {
                authenticate: false
            }
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: 'loginCtrl',
            data: {
                authenticate: false
            }
        }).state('createTodo',{
            url:'/createTodo',
            controller:'TodoCreationController',
            templateUrl:'templates/create-todo.html'
        })
    ;

    // Send to login if the URL was not found
    $urlRouterProvider.otherwise('/login');
})
.controller('rootCtrl', ['$state', function($state) {
    $state.go('home');
}])
.controller('TodoCreationController',['$scope','Todo','$state',function($scope,Todo,$state){

    $scope.todo={};

    $scope.create=function(){
		var imgFile = document.getElementById("imag").src;
        Todo.create({Title :$scope.todo.Title,PIC:imgFile,Username:$scope.todo.username, Phone:$scope.todo.Phone, Details:$scope.todo.Details }).success(function(data){
       
        });
			 
			$state.go('home');
		 // Todo.create({}).success(function(data){
            // 
        // });
    }


}])
.controller('homeCtrl', ['$scope','Todo','$ionicModal'  ,function($scope,Todo,$ionicModal ) {
      $scope.logout = function() {
          console.log('Logout');
          Parse.User.logOut();
          $state.go('login');
      };
	  
	   Todo.getAll().success(function(data){
        $scope.items=data.results;
    });
	  Todo.getAll2().success(function(data){
        $scope.items2=data.results;
    });
   // $scope.loadNewerStories = function(){
	    // Todo.getAll().success(function(data){
        // $scope.items=data.results;
    // });
	  // Todo.getAll2().success(function(data){
        // $scope.items2=data.results;
	   
   // }}
    $scope.onItemDelete=function(item){
        Todo.delete(item.objectId);
        $scope.items.splice($scope.items.indexOf(item),1);
		
    }
	 $scope.todo={};

    $scope.create1=function(item){
		 
        Todo.create1({Title:$scope.todo.Title,CommentId:item.objectId, Username:$scope.todo.username, Phone:$scope.todo.Phone}).success(function(data){
      
        });
		
		    $scope.modal.hide();
 
		location.reload(); 
    }
 
	$ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });  
	  
}])
.controller('loginCtrl', ['$scope', '$state', function($scope, $state) {
    var fbLogged = new Parse.Promise();

    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            return;
        }
        var expDate = new Date(
            new Date().getTime() + response.authResponse.expiresIn * 1000
        ).toISOString();

        var authData = {
            id: String(response.authResponse.userID),
            access_token: response.authResponse.accessToken,
            expiration_date: expDate
        }
        fbLogged.resolve(authData);
        fbLoginSuccess = null;
        console.log(response);
    };

    var fbLoginError = function(error){
        fbLogged.reject(error);
    };

    $scope.login = function() {
      Parse.User.logIn($scope.email, $scope.password, {
        success: function(user) {
          $state.go('home');
        },
        error: function(user, error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });
    };

    $scope.signUpUI = function() {
      $state.go('signup');
    };

    $scope.loginUI = function() {
      $state.go('login');
    };

    $scope.signUp = function() {
      var user = new Parse.User();
      if (!$scope.email) {
        alert('Invalid Email!');
        return;
      }
      user.set("username", $scope.email);
      user.set("password", $scope.password);
      user.set("email", $scope.email);
      user.set("name", $scope.username);

      user.signUp(null, {
        success: function(user) {
          $state.go('home');
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    };

    $scope.loginFB = function() {
        console.log('Login');
        if (!window.cordova) {
            facebookConnectPlugin.browserInit('948962858528782');
        }
        facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);

        fbLogged.then( function(authData) {
            console.log('Promised');
            return Parse.FacebookUtils.logIn(authData);
        })
        .then( function(userObject) {
            var authData = userObject.get('authData');
            facebookConnectPlugin.api('/me', null, 
                function(response) {
                    console.log(response);
                    userObject.set('name', response.name);
                    userObject.set('email', response.email);
                    userObject.save();
                },
                function(error) {
                    console.log(error);
                }
            );
            facebookConnectPlugin.api('/me/picture', null,
                function(response) {
                    userObject.set('profilePicture', response.data.url);
                    userObject.save();
                }, 
                function(error) {
                    console.log(error);
                }
            );
            $state.go('home');
        }, function(error) {
            console.log(error);
        });
    };
}])
