// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('taskmanager', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('Categories', function(){
    return{
        all: function(){
            var categoryString = window.localStorage['categories'];
            if(categoryString){
                return angular.fromJson(categoryString);
            }
            return [];
        },
        save: function(categories){
            window.localStorage['categories'] = angular.toJson(categories);
        },
        newCategory: function(categoryTitle){
            // Add Category
            return {
				title: categoryTitle,
				tasks: []
            };
        },
        getLastActiveIndex: function(){
            return parseInt(window.localStorage['lastActiveCategory']) || 0
        },
        setLastActiveIndex: function(index){
            window.localStorage['lastActiveCategory'] = index;
        }
    }
})

.controller('TaskCtrl', function($scope, $timeout, $ionicModal, Categories, $ionicSideMenuDelegate){

    // Create Category
    var createCategory = function(categoryTitle){
        var newCategory = Categories.newCategory(categoryTitle);
        $scope.categories.push(newCategory);
        Categories.save($scope.categories);
        $scope.selectCategory(newCategory, $scope.categories.length-1);
    }

    // Assign All Categories
    $scope.categories = Categories.all();

    // Get Active Category
    $scope.activeCategory = $scope.categories[Categories.getLastActiveIndex()];

    // Call Category Function With Prompt Form to Enter the Name of Category
    $scope.newCategory = function(){
        var categoryTitle = prompt('Category name');
        if(categoryTitle){
            createCategory(categoryTitle);
        }
    }

    // Select Active Category
    $scope.selectCategory = function(category, index){
        $scope.activeCategory = category;
        Categories.setLastActiveIndex(index);
        $ionicSideMenuDelegate.toggleLeft(false);
    }

    // Load Modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal){
        $scope.taskModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Create Task
    $scope.createTask = function(task){
        if(!$scope.activeCategory || !task){
            return;
        }

        // Create Task Title in HTML (Push)
        $scope.activeCategory.tasks.push({
            title: task.title
        });

        // Hide Modal
        $scope.taskModal.hide();

        // Save Task
        Categories.save($scope.categories);

        // Clear Title
        task.title = "";
    }

    // Remove Task
    $scope.removeTask = function(task){
        for(i = 0; i < $scope.activeCategory.tasks.length;i++){
            if($scope.activeCategory.tasks[i].title == task.title){
                $scope.activeCategory.tasks.splice(i, 1);
                Categories.save($scope.categories);
            }
        }
    }

    // Remove Category
    $scope.removeCategory = function(index){
        //console.log(index);
        $scope.categories.splice(index, 1);
        Categories.save($scope.categories);
    }

    // Open Modal to Create Task
    $scope.newTask = function(){
        $scope.taskModal.show();
    }

    // Close Modal
    $scope.closeNewTask = function(){
        $scope.taskModal.hide();
    }

    // Slide Left to Show Categories
    $scope.toggleCategories = function(){
        $ionicSideMenuDelegate.toggleLeft();
    }

    // Open Prompt Form to Create Task if Not Exist
    $timeout(function(){
        if($scope.categories.length == 0){
            while(true){
                var categoryTitle = prompt('Please Create A Category');
                if(categoryTitle){
                    createCategory(categoryTitle);
                    break;
                }
            }
        }
    });
});
