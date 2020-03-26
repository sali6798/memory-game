$(document).ready(function () {
    // needed to initialize form select 
    $('select').formSelect();

    //====================== global variables ==========================================
    var topic = "";
    var difficulty = "";
    var timer = 0;
    var score = 0;
    var matchesLeft = 0;
    var isCardOne = true;
    var cardOne;
    var photoArray = [];
    var numCols = 0;
    var numRows = 0;
    var boardType = "";

    //================== BELOW THIS IS BUTTON/GET INPUT VALUE EVENT LISTENERS ==================

    // start game timer
    function startGame() {
        // starts timer and displays time
        var timerInterval = setInterval(function () {
            timer--;
            $("#timer").text(timer);

            if ($("#game").hasClass("hide")) {
                clearInterval(timerInterval);
            }

            else if (timer === 0 || matchesLeft === 0) {
                clearInterval(timerInterval);
                loadEndPage();
            }

        }, 1000);
    }
    
    function makeCard(boardType, newRow, pos) {
        var col = $(`<div class='col ${boardType}'>`);
        var card = $("<div class='card'>");
        var cardFront = $("<div class='front'>");
        var newFrontP = $("<p>");
        newFrontP.text("I'm a Placeholder")
        var cardBack = $("<div class='back card-image'>");
        console.log(photoArray[pos]);
        var newImg = $(`<img src="${photoArray[pos]}" alt="card pic">`);
        cardBack.append(newImg);
        cardFront.append(newFrontP);
        card.append(cardFront, cardBack);
        col.append(card);
        newRow.append(col);
        $(card).flip({
            trigger: 'manual'
        });
    }
    
    function makeGameBoard() {
        var pos = 0;
        for (var i = 0; i < numRows; i++) {
            var newRow = $("<div class='row cardRow'>");
            for (var j = 0; j < numCols; j++) {
                makeCard(boardType, newRow, pos);
                pos++;
            }
            $("#cardsContainer").append(newRow);
        }
        
        var secondsLeft = 3;
        var timerInterval = setInterval(function () {
            $("#countdown").text(secondsLeft);
            if (secondsLeft === 0) {
                clearInterval(timerInterval);
                $("#overlay").addClass("hide");
                startGame();
            }
            secondsLeft--;
        }, 1000);

    }

    function setGameTopic(numCards) {
        switch (topic) {
            case "dogs":
                getPexelsDog(numCards);
                break;
            case "cats":
                getCat(numCards);
                break;
            default:
                getLandscape(numCards);
                break;
        }      
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }

    function getCat(numCards) {
        catUrl = "https://api.thecatapi.com/v1/images/search?limit=15&apikey=5767aba7-30b0-4677-a169-9bd06be152b8";

        $.ajax({
            url: catUrl,
            method: "GET"
        }).then(function (response) {
            for (var i = 0; i < numCards / 2; i++) {
                photoArray.push(response[i].url);
                photoArray.push(response[i].url);
            }

            shuffleArray(photoArray);
            makeGameBoard();
        });
    }

    function getPexelsDog(numCards) {
        var rand = Math.floor(Math.random() * 200 + 1);
        pexelsUrl = "https://api.pexels.com/v1/search?query=dogs+query&per_page=15&page=" + rand;

        $.ajax({
            url: pexelsUrl,
            headers: { "Authorization": "563492ad6f9170000100000189da3e3e71c041369167af3e07e5a355" },
            method: "GET",
            type: "text/json"
        }).then(function (response) {
            for (var i = 0; i < numCards / 2; i++) {
                photoArray.push(response.photos[i].src.original);
                photoArray.push(response.photos[i].src.original);
            }

            shuffleArray(photoArray);
            makeGameBoard();
        });

    }
   
    function getLandscape(numCards) {
        var rand = Math.floor(Math.random() * 200 + 1);
        pexelsUrl = "https://api.pexels.com/v1/search?query=landscape+query&per_page=15&page=" + rand;

        $.ajax({
            url: pexelsUrl,
            headers: { "Authorization": "563492ad6f9170000100000189da3e3e71c041369167af3e07e5a355" },
            method: "GET",
            type: "text/json"
        }).then(function (response) {
            for (var i = 0; i < numCards / 2; i++) {
                photoArray.push(response.photos[i].src.original);
                photoArray.push(response.photos[i].src.original);
            }

            shuffleArray(photoArray);
            makeGameBoard();
        });
    }
    
    // loads end page, ask for user's name
    function loadEndPage() {
        $("#game").addClass("hide");
        $("#back").addClass("hide");
        $("#end").removeClass("hide");

        if (timer === 0) {
            $("#endMessage").text("Time is up!");
        }
        else {
            $("#endMessage").text("You won!");
        }
        $("#finalScore").text(score);

    }

    function setGame() {
        difficulty = $("#difficulty").val();
        topic = $("#topic").val();
        switch (difficulty) {
            case "moderate":
                timer = 150;    // 5x4: timer/matchesLeft === 15 seconds per match allowed
                matchesLeft = 10;
                numCols = 5;
                numRows = 4;
                boardType = "fiveByFour";
                break;
            case "hard":
                timer = 150;    // 6x5: timer/matchesLeft === 10 seconds per match allowed
                matchesLeft = 15;
                numCols = 6;
                numRows = 5;
                boardType = "sixByFive";
                break;
            default:
                timer = 120;    // 4x3: timer/matchesLeft === 20 seconds per match allowed
                matchesLeft = 6;
                numCols = 4;
                numRows = 3;
                boardType = "fourByThree";
                break;
        }
        setGameTopic(numCols * numRows);
    }

    function loadGamePage() {
        $("#landing").addClass("hide");
        $("#hof").addClass("hide");
        $("nav").removeClass("hide");
        $("#game").removeClass("hide");

        setGame();
        $("#timer").text(timer);
        $("#score").text(score)
    
    }
    
    // TODO: populate rows in leaderboard if difficulty global var
    // empty, display leaderboard for easy level (default option on view from landing)
    // otherwise display based on difficulty level saved (after user submits name)
    // MVP: just get leaderboard working
    function loadLeaderboard() {
        // append to #leaderboardRows
    }

    function reset() {
        score = 0;
        timer = 0;
        matchesLeft = 0;
        isCardOne = true;
        topic = "";
        difficulty = "";
        photoArray = [];
        $(".card").removeClass("locked");
        $(".card").removeClass("in-play");
        $("#overlay").removeClass("hide");
        $("#back").removeClass("hide");
        $("#cardsContainer").empty();
        $("#topic").prop("selectedIndex", 0);
        $("#difficulty").prop('selectedIndex', 0);
        $("#lbOptions").prop('selectedIndex', 0);
        $('select').formSelect();
    }

    function loadLanding() {
        reset();
        $("#leaderboard").addClass("hide");
        $("nav").addClass("hide");
        $("#hof").removeClass("hide");
        $("#landing").removeClass("hide");
    }

    // event listener for User card selection
    // $(".card").click(function () {
    $(document).on("click", ".card", function() {

        
        // ignore clicks on cards already matched up or in play
        if ($(this).hasClass("locked") || $(this).hasClass("in-play")) {
            console.log("card is locked or in-play: " + $(this).find("p").text());
            return;
        }

        // show the image 
        $(this).flip(true);
        if (isCardOne) {
            cardOne = $(this);
            cardOne.addClass("in-play");
        } else {
            setTimeout(evaluateMatch, 1000, $(this));
        }
        isCardOne = !isCardOne;
    });

    function evaluateMatch(cardTwo) {
        // this is the second card, lets compare the two
        var cardTwoID = cardTwo.find("img").attr("src");
        var cardOneID = cardOne.find("img").attr("src");

        if (cardOneID === cardTwoID) {
            // a match, add some points!
            score += 5;
            matchesLeft--;

            // and keep the cards from flipping again
            cardOne.addClass("locked");
            cardTwo.addClass("locked");
        } else {
            // uh-oh, lose some points
            score -= 1;

            // flip the cards back for another try
            cardTwo.flip(false);
            cardOne.flip(false);
        }

        // whether it was a match or not, cardOne is no longer in-play
        cardOne.removeClass("in-play");

        // update on-screen score
        $("#score").text(score);
    }

    // event listeners
    $("#start").click(loadGamePage);
    $("#home").click(loadLanding);
    $("#back").click(function () {
        $("#game").addClass("hide");
        loadLanding();
    });
    $(".brand-logo").click(function () {
        $("#game").addClass("hide");
        loadLanding();
    })
    // TODO: add user score to leaderboard
    $("#submit").click(function () {
        // gets user input for name
        var user = $("#name").val();


        $("#end").addClass("hide");
        $("#leaderboard").removeClass("hide");
        $("#lbOptionsRow").addClass("hide");
        loadLeaderboard();
    });
    $("#hof").click(function () {
        $("#landing").addClass("hide");
        $("#leaderboard").removeClass("hide");
        $("#lbOptionsRow").removeClass("hide");
        loadLeaderboard();
    });




    //================================== BELOW THIS IS API CALLS =========================================


    // function getMovie() {
    //     var theMovie = "star wars";

    //     var queryUrl = "https://www.omdbapi.com/?t=" + theMovie + "&type=movie&apikey=trilogy";

    //     $.ajax({
    //         url: queryUrl,
    //         method: "GET"
    //     }).then(function (response) {
    //         console.log(response);
    //         console.log(response.Poster)
    //     })

    // }


    // function getNASA() {
    //     var randomYear = Math.floor(Math.random() * (2020 - 2015) + 2010);
    //     var randomMonth = Math.floor(Math.random() * (12 - 1) + 1);
    //     var randomDate = Math.floor(Math.random() * (28 - 1) + 1);
    //     var NASAUrl = `https://api.nasa.gov/planetary/apod?date=${randomYear}-${randomMonth}-${randomDate}&api_key=2YVxSEGEXJwH01Wb6QwvfeJyAWtXzKRNBVhIbVJb`


    //     $.ajax({
    //         url: NASAUrl,
    //         method: "GET"
    //     }).then(function (response) {
    //         console.log(response.url);
    //     })
    // }

});