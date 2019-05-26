App = {
  loading: false,
  contracts: {},
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },
  //  Load Account
  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },
  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const meterList = await $.getJSON('Meter.json')
    App.contracts.MeterList = TruffleContract(meterList)
    App.contracts.MeterList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.meterList = await App.contracts.MeterList.deployed()
  },

  render: async () => {

    var meterInstance = App.meterList;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load the total task count from the blockchain
    const meterCount = await App.meterList.meterCount()
    const meter1 = await App.meterList.readingList(1)
    // Meter UID
    console.log(meter1[0].c[0]);
    // Key hash
    console.log(meter1[1]);
    // Reading
    console.log(meter1[2].c[0]);

    // timestamp
    console.log(meter1[3])
    // status
    console.log(meter1[4])

    //the total Meter in the system
    console.log(meterCount.c[0])
    // const $taskTemplate = $('.taskTemplate')



    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
      var meterCountResults = $("#meterCountResults");
      meterCountResults.empty();
      console.log("mwetwer",meterCount);

      for (var i = 1; i <= meterCount.c[0]; i++) {
        meterInstance.readingList(i).then(function(readMeter) {
          var uid = readMeter[0].c[0];
          var reading = readMeter[2].c[0];
          var timestamp = readMeter[3];
          var status = readMeter[4] ? 'activated':'inactivated';
          console.log(readMeter[4]);

          // Render candidate Result
          var meterTemplate = "<tr><th>" + uid + "</th><td>" + reading + "</td><td>" + timestamp + "</td><td>" + status + "</td></tr>"
          meterCountResults.append(meterTemplate);
        });
      }

      loader.hide();
      content.show();




  },
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    },
    readReading: function(){
      console.log("call from the client");
    }
  }

$(() => {
  $(window).load(() => {
    App.load()
  })
})
