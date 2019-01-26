$("#time-input").timepicker({
  showSeconds: false,
  showMeridian: false,
  defaultTime: false
});

// Firebase Initialization
var config = {
  apiKey: "AIzaSyDYFexeS2UB59ppBoDyTDN52WIERGRPnHM",
  authDomain: "train-schedule-eeeb7.firebaseapp.com",
  databaseURL: "https://train-schedule-eeeb7.firebaseio.com",
  projectId: "train-schedule-eeeb7",
  storageBucket: "train-schedule-eeeb7.appspot.com",
  messagingSenderId: "210873347277"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName;
var destination;
var startTime;
var frequency;
var minutesAway;
var nextArrival;

function calculateTime() {
  var startTimeConvert = moment(startTime, "hh:mm");
  var timeDifference = moment().diff(moment(startTimeConvert), "minutes");
  timeRemaining = timeDifference % parseInt(frequency);
  minutesAway = parseInt(frequency) - timeRemaining;
  nextArrival = moment().add(minutesAway, "minutes");
};

$("#submit-button").on("click", function (event) {
  event.preventDefault();

  trainName = $("#name-input").val().trim();
  destination = $("#destination-input").val().trim();
  startTime = $("#time-input").val().trim();
  frequency = $("#frequency-input").val().trim();

  var newTrain = {
    name: trainName,
    dest: destination,
    start: startTime,
    freq: frequency
  };

  database.ref().push(newTrain);

  calculateTime();

  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {

  trainName = childSnapshot.val().name;
  destination = childSnapshot.val().dest;
  startTime = childSnapshot.val().start;
  frequency = childSnapshot.val().freq;

  calculateTime();

  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(moment(nextArrival).format("LT")),
    $("<td>").text(minutesAway),
  );

  $("#train-schedule > tbody").append(newRow);

});