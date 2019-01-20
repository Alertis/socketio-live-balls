app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

    $scope.messages=[ ];
    $scope.palyers={ };
    $scope.init=() => {
        const username = prompt('Please enter username');

        if(username)
            initSocket(username);
        else
            return false;
    };

    function initSocket(username){
        const connectionOptions={
            reconnectionAttempts:3,
            reconnectionDelay:600
        };

        indexFactory.connectSocket('http://localhost:3000',connectionOptions)
        .then((socket) => {
            socket.emit('newUser',{username});
            
            socket.on('initPlayers',(players)=>{
                $scope.players=players;
                $scope.$apply();
            });

            socket.on('newUser',(data)=>{
                const messageData={
                    type:{
                        code:0, //server or user message
                        message:1 //login or disconnect message
                    },
                    username:data.username
                };

                $scope.messages.push(messageData);
                $scope.$apply();
            });

            socket.on('disUser',(data) => {
                const messageData={
                    type:{
                        code:0,
                        message:0
                    },
                    username:data.username
                };
                $scope.messages.push(messageData);
                $scope.$apply();
            })
        }).catch((err)=>{
            console.log(err);
        });
    }
}]);