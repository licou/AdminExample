// define angular module/app
var formApp = angular.module('formApp', ['ngRoute']);

formApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/main', {
        templateUrl: 'view/main.html',
        controller: 'MainController',
        
    })
    .when('/see_last', {
        templateUrl: 'view/see_info.html',
        controller: 'InfoController',
        
    })
    .when('/add_info', {
        templateUrl: 'view/add_info.html',
        controller: 'AlterInfoController',
        
    })
    .when('/del_info', {
        templateUrl: 'view/del_info.html',
        controller: 'InfoController',
        
    })
    .when('/upd_info', {
        templateUrl: 'view/upd_info.html',
        controller: 'AlterInfoController',
        
    })
    .when('/statistiques_textes', {
        templateUrl: 'view/statistiques_textes.html',
        controller: 'StatsController',
        
    })
    .when('/statistiques_details', {
        templateUrl: 'view/statistiques_details.html',
        controller: 'StatsDetailController',
        
    })
    .otherwise({
        redirectTo: '/main'
    });
  
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

/* controller to see last info and del info */
function InfoController($scope, $http) {
    //databinding
    $scope.formData = {};
    $scope.master = {};

    //on indique le nombre de info totale
    $scope.nbinfo = function() {
        $http({method: 'GET', url: '/model/info.php?action=get_nb_info'})
            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.nb_info = data.nb_info;                  //set view model
            })
            .error(function(data, status, headers, config) {
                $scope.nb_info = data || "Request failed";
                $scope.status = status;
            });
    }

    //on valide le formulaire de suppression
    //Delete info
    $scope.processDelForm = function() {
        $http({
            method  : 'POST',
            url     : '/model/info.php?action=del',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            if (!data.success) {
                // if not successful, bind errors to error variables
                $scope.errorId = data.errors.id;
            } else {
                // if successful, bind success message to message
                $scope.message = data.message;
                $scope.formData = angular.copy($scope.master);
                $scope.nb_info =  data.nb_info_total;
            }
        });
    };

    $scope.listLastInfo = function() {
        
        $http({
            method: 'GET', 
            url: '/model/info.php?action=get_last_info'
        })
        .success(function(data, status, headers, config) {
           
            $scope.infos = data;
             console.log("data last = "+$scope.infos);
        });
    };

    $scope.processViewInfo = function() {
        $http({
            method  : 'POST',
            url     : '/model/info.php?action=get_info_by_id',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(data) {
            if (!data.success) {
                // if not successful, bind errors to error variables
                $scope.errorId = data.errors.id;
            } else {
                // if successful, bind success message to message
                $scope.formData.info = data.datas.info;
                $scope.viewInfo = true;
               
            }
        });
    };

    $scope.nbInfo();
    $scope.listLastInfo();
}

function AlterInfoController($scope, $http) {
    //databinding
    $scope.formData = {};
    $scope.master = {};
    $scope.formData.info = {};

    //on valide le formulaire d'ajout
    $scope.processAddForm = function() {
        $http({
            method  : 'POST',
            url     : '/model/info.php?action=add',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            console.log(data);
            if (!data.success) {
                // if not successful, bind errors to error variables
                $scope.errorInfo = data.errors.info;
            } else {
                // if successful, bind success message to message
                $scope.errorInfo ="";
                $scope.message = data.message;
                $scope.formData = angular.copy($scope.master);
            }
        });
    };

    $scope.processViewInfo = function() {
        $http({
            method  : 'POST',
            url     : '/model/info.php?action=get_info_by_id',
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(data) {
            if (!data.success) {
                $scope.errorId = data.errors.id;
            } else {
                $scope.formData.info = data.datas.info;
                $scope.viewInfo = true;
               
            }
        });
    };

    $scope.processUpdForm = function(){
        $http({
            method  : 'POST',
            url     : '/model/info.php?action=upd&id='+$scope.formData.id,
            data    : $.param($scope.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(data) {
            if (!data.success) {
                // if not successful, bind errors to error variables
                $scope.errorId = data.errors.id;
                $scope.errorInfo = data.errors.info;
            } else {
                // if successful, bind success message to message
                $scope.message = data.message;   
                $scope.formData = angular.copy($scope.master);   
                $scope.viewInfo = false;     
            }
        });
    }

}

function StatsController($scope, $http) {
    //databinding
    $scope.textes = {};
   

    $scope.getStats = function() {
        $http({method: 'GET', url: '/model/info.php?action=getStats'})
            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.textes = data.statistiques;
                
            })
            .error(function(data, status, headers, config) {
                $scope.nb_info = data || "Request failed";
                $scope.status = status;
            });
    }

    $scope.getStats();
   
}

function StatsDetailController($scope, $http){
    
    $scope.details = {};
    $scope.predicate = ["-pct_visiteur","pct_texte"];
    
    $scope.getStatsDetails = function() {
       
        $http({method: 'GET', url: '/model/info.php?action=getStatsDetail'})
            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.details = data.details;
                angular.forEach($scope.details, function(detail) {

                   if((detail.pct_texte=="100") || (detail.pct_texte=="90") || (detail.pct_texte=="80") || (detail.pct_texte=="70") ){
                        if(detail.pct_visiteur>=80 && detail.pct_visiteur<90){
                            detail.warning="true";
                            detail.mustalert="true"; //pour le filtre dans l'index
                            $scope.alert=true; // pour la page d'index de l'admin

                        }
                        else{
                            if(detail.pct_visiteur>=90 ){
                                detail.danger="true";
                                detail.mustalert="true"; //pour le filtre dans l'index
                                $scope.alert=true; // pour la page d'index de l'admin
                            }
                        }
                   }
                })  
            })
            .error(function(data, status, headers, config) {
                $scope.details = data || "Request failed";
                $scope.status = status;
            });
    }

    $scope.getStatsDetails();
}

function MainController($scope, $http) {
	//databinding
	$scope.formData = {};
    $scope.nb_info=0;
	//on indique le nombre de info totale
	$scope.nbInfo = function() {
        $http({method: 'GET', url: '/model/info.php?action=get_nb_info'})
        	.success(function(data, status, headers, config) {
                console.log(data);
                $scope.nb_info = data.nb_info;                  //set view model
            })
            .error(function(data, status, headers, config) {
                $scope.nb_info = data || "Request failed";
                $scope.status = status;
            });
    }

    //nombre de personnes avec cookie
    $scope.nbCookie = function() {
        $http({method: 'GET', url: '/model/info.php?action=get_nb_cookie'})
            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.nb_cookie = data.nb_cookie;                  //set view model
            })
            .error(function(data, status, headers, config) {
                $scope.nb_cookie = data || "Request failed";
                $scope.status = status;
            });
    }

    //historique
    $scope.getHistory = function() {
        $http({method: 'GET', url: '/model/info.php?action=get_history'})
            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.list_history = data.list_history;                  //set view model
                $scope.pct_texte_lu = (($scope.list_history.nb_texte_lu/$scope.nb_info)*100).toFixed(2);
            })
            .error(function(data, status, headers, config) {
                $scope.list_history = data || "Request failed";
                $scope.status = status;
            });
    }

	$scope.nbInfo();
    $scope.nbCookie();
    $scope.getHistory();
}