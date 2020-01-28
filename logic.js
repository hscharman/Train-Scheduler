//Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyBotE9jEvRPMqsLS6AdaKL_8ZRhomGy0lY",
    authDomain: "train-scheduler-8bc88.firebaseapp.com",
    databaseURL: "https://train-scheduler-8bc88.firebaseio.com",
    projectId: "train-scheduler-8bc88",
    storageBucket: "train-scheduler-8bc88.appspot.com",
    messagingSenderId: "728639105710",
    appId: "1:728639105710:web:c0fb4a0651ecf870301b3f"
  };

// Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var trainData = firebase.database();

//"Add train" button
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

//Grab user's train input
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var destination = $("#destination-input")
    .val()
    .trim();
  var firstTrain = $("#first-train-input")
    .val()
    .trim();
  var frequency = $("#frequency-input")
    .val()
    .trim();

  // Create a var that will hold user's train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

// Push user's train into our main Data. 
  trainData.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  alert("Train has been added!");

// Clear text boxes for next use
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// New firebase event
// New html row
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

// Store data in variables
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  // If the first train is later than the current time, set arrival to the first train time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {

    // Minutes till arrival
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    // To calculate the arrival time, add the tMinutes to the current time
    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  // Add each train's data into the table
  $("#train-table > tbody").append(
    $("<tr>").append(
      $("<td>").text(tName),
      $("<td>").text(tDestination),
      $("<td>").text(tFrequency),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    )
  );
});

