
var marvelDc = angular.module('marvelDcApp', ['templates', 'ngRoute', 'ng-rails-csrf', 'ngAnimate']);

marvelDc.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'home_template.html',
    controller: 'homeController'
  })
  // .when('/play', {
  //   templateUrl: 'endurance_template.html',
  //   controller: 'enduranceController'
  // })
  .when('/lightning', {
    templateUrl: 'lightning_template.html',
    controller: 'lightningController'
  })
  .when('/end', {
    templateUrl: 'end_template.html',
    controller: 'endController'
  });
});


marvelDc.service('dataService', ['$http','$q', function($http, $q){
  this.characterStatus = {
    groups: [
      {
        start: 0,
        end: 5
      },
      {
        start: 5,
        end: 10
      },
      {
        start: 10,
        end: 15
      },
      {
        start: 15,
        end: 20
      },
      {
        start: 20,
        end: 25
      },
      {
        start: 25,
        end: 30
      },
      {
        start: 30,
        end: 35
      },
      {
        start: 35,
        end: 40
      },
      {
        start: 40,
        end: 45
      },
      {
        start: 45,
        end: 50
      },
      {
        start: 50,
        end: 55
      },
      {
        start: 55,
        end: 60
      },
      {
        start: 60,
        end: 65
      },
      {
        start: 65,
        end: 70
      },
      {
        start: 70,
        end: 75
      },
      {
        start: 75,
        end: 80
      }
    ],
    seenMatrix:[
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]
  }
  this.resetMatrix = function(){
    this.characterStatus.seenMatrix = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,]
  }  
  this.pickCharacters = function(){
    var dcHeros;
    var dcVillians;
    var marvelHeros;
    var marvelVillians;
    while(true){
      if (this.characterStatus.seenMatrix[0] == true && 
          this.characterStatus.seenMatrix[1] == true && 
          this.characterStatus.seenMatrix[2] == true &&
          this.characterStatus.seenMatrix[3] == true ){
            break;
      }

      var renderNum = Math.floor(Math.random() * (4));

      if (this.characterStatus.seenMatrix[renderNum] === false){
        this.characterStatus.seenMatrix[renderNum] = true;
        dcHeros = renderNum;
        break;
      }
    }
    while(true){
      if (this.characterStatus.seenMatrix[4] == true && 
          this.characterStatus.seenMatrix[5] == true && 
          this.characterStatus.seenMatrix[6] == true &&
          this.characterStatus.seenMatrix[7] == true ){
            break;
      }

      var renderNum = Math.floor(Math.random() * (4)) + 4;

      if (this.characterStatus.seenMatrix[renderNum] === false){
        this.characterStatus.seenMatrix[renderNum] = true;
        dcVillians = renderNum;
        break;
      }
    }
    while(true){
      if (this.characterStatus.seenMatrix[8] == true && 
          this.characterStatus.seenMatrix[9] == true && 
          this.characterStatus.seenMatrix[10] == true &&
          this.characterStatus.seenMatrix[11] == true){
            break;
      }

      var renderNum = Math.floor(Math.random() * (4)) + 8;

      if (this.characterStatus.seenMatrix[renderNum] === false){
        this.characterStatus.seenMatrix[renderNum] = true;
        marvelHeros = renderNum;
        break;
      }
    }
    while(true){
      if (this.characterStatus.seenMatrix[12] == true && 
          this.characterStatus.seenMatrix[13] == true && 
          this.characterStatus.seenMatrix[14] == true &&
          this.characterStatus.seenMatrix[15] == true){
            break;
      }

      var renderNum = Math.floor(Math.random() * (4)) + 12;
      if (this.characterStatus.seenMatrix[renderNum] === false){
        this.characterStatus.seenMatrix[renderNum] = true;
        marvelVillians = renderNum;
        break;
      }
    }

    return [
              this.characterStatus.groups[dcHeros], 
              this.characterStatus.groups[dcVillians],
              this.characterStatus.groups[marvelHeros],
              this.characterStatus.groups[marvelVillians],
            ];
  }
  this.getCharacters = function(start, callback){
    $http.get("/characters.json?start=" + start).then(callback);
  }
  this.getCharactersTwo = function(location, callback){
    var one = $http.get("/characters.json?start=" + location[0].start),
        two = $http.get("/characters.json?start=" + location[1].start),
        three = $http.get("/characters.json?start=" + location[2].start),
        four = $http.get("/characters.json?start=" + location[3].start);

    $q.all([one, two, three, four]).then(callback);
  }


}]);
marvelDc.service('gameplayService', [function(){
  this.gameStats = {
    started: false,
    ended: false,
    score: 0,
  }

  this.resetGameStats = function (){
    this.gameStats = {
      started: false,
      ended: false,
      score: 0,
    }
  }
}]);

marvelDc.controller('homeController', ['$scope', function ($scope) {
  $scope.hello = "hello";

}]);

// marvelDc.controller('enduranceController', ['$scope','dataService', function ($scope, dataService) {
//   $scope.hello = "endur";

// }]);

marvelDc.controller('lightningController', ['$scope','$timeout','$location', 'dataService', 'gameplayService', 
  function ($scope, $timeout, $location, dataService, gameplayService) {

  $scope.counter = 60;
  dataService.resetMatrix();
  gameplayService.resetGameStats();

  gameplayService.gameStats.started = true;


  $scope.countdown = function(){
    $timeout(function() {
        if ($scope.counter === 0 || $scope.counter < 0){
          endgame();
        }else{
          $scope.counter--;   
          $scope.countdown(); 
        }  
    }, 1000);
  }

  var endgame = function(){
    gameplayService.gameStats.ended = true;
    $location.path( "/end" );
  }

  $scope.list = [];
  var index = 0;
  $scope.score = 0;

  var getCharacterList = function(){
    currentRound = dataService.pickCharacters();
    dataService.getCharactersTwo(currentRound, function(response){

      var templist = [];
      for (var i = 0; i < 4; i ++){
        templist = templist.concat(response[i].data.character);
      }
      templist = shuffle(templist);
      $scope.list = $scope.list.concat(templist);
      if (index === 0){
        $scope.current = $scope.list[0];
      }
      
      


      //console.log($scope.list);
    });
  }

  getCharacterList();

  var shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  $scope.ansMarvel = function(){
    //console.log(index);
    loadNewCheck();
    if ($scope.current.universe === "marvel"){
      index ++;
      $scope.current = $scope.list[index];
      gameplayService.gameStats.score ++;
      $scope.score = gameplayService.gameStats.score;
    }else{
      endgame();
    }
  }
  $scope.ansDc = function(){
    //console.log(index);
    loadNewCheck();
    if ($scope.current.universe === "dc"){
      index ++;
      $scope.current = $scope.list[index];
      gameplayService.gameStats.score ++;
      $scope.score = gameplayService.gameStats.score;
    }else{
      endgame();
    }    
  }

  var loadNewCheck = function(){
    //console.log(index);
    if (index == 10 || index == 30 || index == 50){
      getCharacterList();
    }
  }

  var bar = new ProgressBar.Circle(countContianer, {
    color: '#aaa',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    duration: 60000,
    text: {
      autoStyleContainer: false
    },
    from: { color: '#f1c40f', width: 4 },
    to: { color: '#e74c3c', width: 4 },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);

      var value = Math.round(circle.value() * 60);
       circle.setText(value);
      //bar.text.style.color = state.color;

    }
  });

  bar.text.style.fontSize = '2rem';
  bar.animate(1.0);  // Number from 0.0 to 1.0





  $scope.countdown();


}]);

marvelDc.controller('endController', ['$scope','dataService','gameplayService', function ($scope, dataService, gameplayService) {
  var playerScore = gameplayService.gameStats.score * 100;
  if (gameplayService.gameStats.started == true && gameplayService.gameStats.ended == true){
    $scope.legitGame = true;
    $scope.score = gameplayService.gameStats.score * 100;

  }
  else{
    $scope.legitGame = false;
    $scope.oops = "Oops! Something went wrong.";
  }

  var bar2 = new ProgressBar.SemiCircle(scoreContianer, {
    strokeWidth: 6,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
      value: '',
      alignToBottom: false
    },
    from: {color: '#f1c40f'},
    to: {color: '#2ecc71'},
    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = Math.round(bar.value() * 8000);
      bar.setText(value);
      

      bar.text.style.color = state.color;
    }
  });
  bar2.text.style.fontFamily = '"Orbitron", Helvetica, sans-serif';
  bar2.text.style.fontSize = '2.5rem';

  bar2.animate(playerScore/8000);


  
}]);


