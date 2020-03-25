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

    //================== BELOW THIS IS BUTTON/GET INPUT VALUE EVENT LISTENERS ==================

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

    // start game timer
    function startGame() {
        // starts timer and displays time
        var timerInterval = setInterval(function () {
            timer--;
            $("#timer").text(timer);

            if ($("#game").hasClass("hide")) {
                clearInterval(timerInterval);
                console.log("done");
            }

            if (timer === 0 || matchesLeft === 0) {
                clearInterval(timerInterval);
                loadEndPage();
            }

        }, 1000);

        // TODO: update score (global var)
        // TODO: clear interval/stop timer when user finds all matches first
    }

    function setTimerLength() {
        difficulty = $("#difficulty").val();

        if (difficulty === "moderate") {
            timer = 150;    // 5x4: timer/matchesLeft === 15 seconds per match allowed
            matchesLeft = 10;
        }
        else if (difficulty === "hard") {
            timer = 150;    // 6x5: timer/matchesLeft === 10 seconds per match allowed
            matchesLeft = 15;
        }
        else {
            timer = 120;    // 4x3: timer/matchesLeft === 20 seconds per match allowed
            matchesLeft = 3; // TODO: put back to 6!!! 3 was for testing (diana)
        }
    }

    function loadGamePage() {
        $("#landing").addClass("hide");
        $("#hof").addClass("hide");
        $("nav").removeClass("hide");
        $("#game").removeClass("hide");

        setTimerLength();
        $("#timer").text(timer);
        // TODO: create cards with API
        // size based on difficulty (global var)


        // if not topic chosen, val will be null - pick random topic
        var topic = $("#topic").val();

        // countdown before game begins (overlay)
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
        $(".card").removeClass("locked");
        $(".card").removeClass("in-play");
        $("#overlay").removeClass("hide");
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
    $(".card").click(function () {
        // ignore clicks on cards already matched up or in play
        if ($(this).hasClass("locked")) {
            console.log("card is locked: " + $(this).find("p").text());
            return;
        }
        if ($(this).hasClass("in-play")) {
            console.log("card is in-play: " + $(this).find("p").text());
            return;
        }

        // TODO: what happens if the user flips the SAME card. Of course it will match src, but it should also NOT match on some other identifier
        // use a tag like locked, but different "open" "semi-lock" ???
        // maybe could judge based on the state of the flip?
        // maybe just "number" the cards as they are built?

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
    $(".brand-logo").click(function() {
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
    // manual is required in order to flip or lock cards into place when evaluating user picks
    $(".card").flip({
        trigger: 'manual' 
    });

    // getPexels();
    // getDog();
    // getCat();
    var imgTag = $("img");


    function getCat() {
        catUrl = "https://api.thecatapi.com/v1/images/search?limit=5&apikey=5767aba7-30b0-4677-a169-9bd06be152b8";



        $.ajax({
            url: catUrl,
            method: "GET"
        }).then(function (response) {
            imgTag.attr("src", response[0].url);
            console.log(response)

        });

    };

    function getDog() {

        dogUrl = "https://dog.ceo/api/breeds/image/random"

        $.ajax({
            url: dogUrl,
            method: "GET"
        }).then(function (response) {
            imgTag.attr("src", response.message);
            console.log(response)

        });

    };

    function getPexels() {
        pexelsUrl = "https://api.pexels.com/v1/search?query=dogs"

        $.ajax({
            url: pexelsUrl,
            headers: { "Authorization": "563492ad6f9170000100000189da3e3e71c041369167af3e07e5a355" },
            method: "GET"
        }).then(function (response) {
            imgTag.attr("src", response.photos[0].src.original);
            console.log(response)

        });

    }

    // Authorization: 563492ad6f9170000100000189da3e3e71c041369167af3e07e5a355

    // // img.each(function(index) {
    //      if (index < 2) {
    //    attr(src, img[0]) }
    //     else if (index >= 2 && index < 4)
    //    attr(src, img[1]) ... and so on. need to loop through and randomize array too...
    // })



    // omdb, nasa, pixabay etc...    
});

