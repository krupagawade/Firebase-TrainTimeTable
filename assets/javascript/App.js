  // Initialize Firebase
var config = {
    apiKey: "AIzaSyACzlzj_zL0Zo6GP5nIJ2jf3XU5kXefvMc",
    authDomain: "mytrainschedulerproject.firebaseapp.com",
    databaseURL: "https://mytrainschedulerproject.firebaseio.com",
    projectId: "mytrainschedulerproject",
    storageBucket: "mytrainschedulerproject.appspot.com",
    messagingSenderId: "722946599185"
};

//Initialize the firebase app
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
var trainName = "";
var dest = "";
var firstTrain = "";
var freqMins = 0;

$("#submit-form").on("click", function(event) {
    event.preventDefault();  
    // Get the input values
    trainName = $("#inputTrainName").val().trim();
    dest = $("#inputDestination").val().trim();
    firstTrain = $("#firstTrainTime").val().trim();
    freqMins = parseInt($("#inputFrequency").val().trim());

    // Save the new price in Firebase
    database.ref().push({
        trainName: trainName,
        destination: dest,
        firstTrain: firstTrain,
        frequency: freqMins,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });//End push

      //$("#trainForm").reset();
      $('input[type="text"], textarea').val('');
      $('input[type="time"], textarea').val('');
      $('input[type="number"], textarea').val('');

   // renderTable();

}); //end of submit button

//function renderTable(){
    database.ref().on("child_added", function(childSnapshot) {

    var traindetails = getNextArrival(childSnapshot.val().firstTrain, childSnapshot.val().frequency);

    //Update Table
        var tBody = $("tbody");

        var tRow = $("<tr>");
        var sv = childSnapshot.val();
        var trainTd = $("<td>").text(sv.trainName);
        var destTd = $("<td>").text(sv.destination);
        var freqTd = $("<td>").text(sv.frequency);
        var nextTrainTd = $("<td>").text(traindetails.nextArrival);
        var timeAwayTd = $("<td>").text(traindetails.timeAway);
        var keyRecord = childSnapshot.key;
        var deleteBtn = $("<button>").text("Delete").attr("id",keyRecord).addClass("deleteBtn btn btn-warning");    

        // Append the newly created table data to the table row
        tRow.append(trainTd, destTd, freqTd, nextTrainTd, timeAwayTd,deleteBtn);
        // Append the table row to the table body
        tBody.append(tRow);
 
});
//}

function getNextArrival(firstTime, frequency){


    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm A").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;


    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    return trainTime = {"timeAway": tMinutesTillTrain, "nextArrival" : moment(nextTrain).format("hh:mm A") }
}

$(document).ready(function() {
});

$("body").on("click", ".deleteBtn", function () {
    var keyID = this.id;
    firebase.database().ref(keyID).remove();
    location.reload(); 
});

