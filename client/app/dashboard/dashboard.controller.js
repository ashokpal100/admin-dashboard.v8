(function(){
  angular.module('app')
  .controller('AppCtrl',['$scope', function($scope) {
    console.log("came here DashboardCtrl");


    // Use SockJS
    Stomp.WebSocketClass = SockJS;
    
    // Connection parameters
    var mq_username = "guest",
        mq_password = "guest",
        mq_vhost    = "/",
        mq_url      = 'http://192.168.43.183:15674/stomp',
    
        mq_queue    = "/topic/mymessages";
    
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
      console.log(m);
    
    }
    
    // Create a client
    var client = Stomp.client(mq_url);
    
    window.onload = function () {
      // Fetch output panel
      output = document.getElementById("output");
    
      // Connect
      client.connect(
        mq_username,
        mq_password,
        on_connect,
        on_connect_error,
        mq_vhost
      );
    }


  }]);
})();