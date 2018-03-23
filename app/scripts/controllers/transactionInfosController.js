angular.module('ethExplorer').controller('transactionInfosCtrl', function($rootScope, $scope, $location, $routeParams, $q) {

  var web3 = $rootScope.web3;
  var abi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "people",
      "outputs": [
        {
          "name": "name",
          "type": "bytes32"
        }, {
          "name": "accType",
          "type": "bytes32"
        }, {
          "name": "holdings",
          "type": "uint256"
        }, {
          "name": "balance",
          "type": "uint256"
        }, {
          "name": "priceQuoted",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }, {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "addressList",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }, {
      "constant": true,
      "inputs": [],
      "name": "centralGovt",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }, {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    }, {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        }, {
          "name": "_qty",
          "type": "uint256"
        }
      ],
      "name": "buyGrains",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }, {
      "constant": true,
      "inputs": [
        {
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getPerson",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }, {
          "name": "",
          "type": "bytes32"
        }, {
          "name": "",
          "type": "uint256"
        }, {
          "name": "",
          "type": "uint256"
        }, {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }, {
      "constant": false,
      "inputs": [
        {
          "name": "_myAddress",
          "type": "address"
        }, {
          "name": "_firstName",
          "type": "bytes32"
        }, {
          "name": "_accType",
          "type": "bytes32"
        }, {
          "name": "_holdings",
          "type": "uint256"
        }, {
          "name": "_balance",
          "type": "uint256"
        }, {
          "name": "_priceQuoted",
          "type": "uint256"
        }
      ],
      "name": "addPerson",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
console.log(abi);
abiDecoder.addABI(abi);
  $scope.init = function() {
    $scope.txId = $routeParams.transactionId;

    if ($scope.txId !== undefined) { // add a test to check if it match tx paterns to avoid useless API call, clients are not obliged to come from the search form...

      getTransactionInfos().then(function(result) {
        //TODO Refactor this logic, asynchron calls + services....
        var number = web3.eth.blockNumber;

        $scope.result = result;

        if (result.blockHash !== undefined) {
          $scope.blockHash = result.blockHash;
        } else {
          $scope.blockHash = 'pending';
        }
        if (result.blockNumber !== undefined) {
          $scope.blockNumber = result.blockNumber;
        } else {
          $scope.blockNumber = 'pending';
        }
        $scope.from = result.from;
        $scope.gas = result.gas;
        $scope.gasPrice = result.gasPrice.c[0] + " WEI";
        $scope.hash = result.hash;
        $scope.input = result.input; // that's a string
        var decodedData = abiDecoder.decodeMethod(result.input);



        var decodedDataText = JSON.stringify(decodedData);

        //Fast Json beautification:
$scope.decodedInput = decodedData;

        $scope.nonce = result.nonce;
        $scope.to = result.to;
        $scope.transactionIndex = result.transactionIndex;
        $scope.ethValue = result.value.c[0] / 10000;
        $scope.txprice = (result.gas * result.gasPrice) / 1000000000000000000 + " ETH";
        if ($scope.blockNumber !== undefined) {
          $scope.conf = number - $scope.blockNumber;
          if ($scope.conf === 0) {
            $scope.conf = 'unconfirmed'; //TODO change color button when unconfirmed... ng-if or ng-class
          }
        }
        //TODO Refactor this logic, asynchron calls + services....
        if ($scope.blockNumber !== undefined) {
          var info = web3.eth.getBlock($scope.blockNumber);
          if (info !== undefined) {
            $scope.time = info.timestamp;
          }
        }

      });

    } else {
      $location.path("/"); // add a trigger to display an error message so user knows he messed up with the TX number
    }

    function getTransactionInfos() {
      var deferred = $q.defer();

      web3.eth.getTransaction($scope.txId, function(error, result) {
        if (!error) {
          deferred.resolve(result);
        } else {
          deferred.reject(error);
        }
      });
      return deferred.promise;

    }

  };
  $scope.init();
  // console.log($scope.result);

});
