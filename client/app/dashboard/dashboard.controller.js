(function(){
  angular.module('app')
  .controller('dashboardCtrl',['$scope', function($scope) {
    console.log("came here DashboardCtrl");

    $scope.inOutStatus = [];

    // Use SockJS
    Stomp.WebSocketClass = SockJS;
    
    // Connection parameters
    var mq_username = "admin",
        mq_password = "admin",
        mq_vhost    = "/",
        mq_url      = 'http://34.229.147.142:15674/stomp',
    
        mq_queue    = "/topic/fluid_queue";
    
    // This is where we print incomoing messages
     console.log(mq_url);
    
    // This will be called upon successful connection
    function on_connect() {
      console.log("Connected to RabbitMQ-Web-Stomp");
      console.log(client);
      client.subscribe(mq_queue, on_message);
    }
    
    // This will be called upon a connection error
    function on_connect_error() {
      console.log("Connection failed");
    }
    
    // This will be called upon arrival of a message
    function on_message(m) {
      console.log('message received'); 
      // console.log(m);
      msg_from_stomp = JSON.parse(m.body);
      console.log(msg_from_stomp);
      if ($scope.inOutStatus.length) {
        
        for (var i = 0; i < $scope.inOutStatus.length; i++) {
          // $scope.inOutStatus[i];
          if ($scope.inOutStatus[i].kid_name==msg_from_stomp.kid_name) {

              $scope.inOutStatus[i].datetime = msg_from_stomp.datetime;
              $scope.inOutStatus[i].status = msg_from_stomp.status;

          }else{
            $scope.inOutStatus.push(msg_from_stomp);
          }
        }

      }else{
          $scope.inOutStatus.push(msg_from_stomp);
      }
      console.log($scope.inOutStatus);
      $scope.$apply();

      
    
    };
    
    // Create a client
    var client = Stomp.client(mq_url);
    // Connect
    client.connect(
      mq_username,
      mq_password,
      on_connect,
      on_connect_error,
      mq_vhost
    );
    


  }]);
})();