$(document).ready(function() {
    // needed to initialize form select 
    $('select').formSelect();

    //====================== global variables ==========================================
    var topic = "";
    var difficulty = "";
    var timer = 0;
    var score = 0;

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
        var timerInterval = setInterval(function() {
            timer--;
            $("#timer").text(timer);

            if ($("#game").hasClass("hide")) {
                clearInterval(timerInterval);
                console.log("done");
            }
            
            if (timer === 0) {
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
            timer = 180;
        }
        else if (difficulty === "hard") {
            timer = 200;
        }
        else {
            timer = 120;
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
        var timerInterval = setInterval(function() {
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
        topic = "";
        difficulty = "";
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

    // event listeners
    $("#start").click(loadGamePage);
    $("#home").click(loadLanding);
    $("#back").click(function() {
        $("#game").addClass("hide");
        loadLanding();
    });
    $(".brand-logo").click(function() {
        $("#game").addClass("hide");
        loadLanding();
    })
    // TODO: add user score to leaderboard
    $("#submit").click(function() {
        // gets user input for name
        var user = $("#name").val();

        
        $("#end").addClass("hide");
        $("#leaderboard").removeClass("hide");
        $("#lbOptionsRow").addClass("hide");
        loadLeaderboard();
    });
    $("#hof").click(function() {
        $("#landing").addClass("hide");
        $("#leaderboard").removeClass("hide");
        $("#lbOptionsRow").removeClass("hide");
        loadLeaderboard();
    });

    

   
    //================================== BELOW THIS IS API CALLS =========================================
    $(".card").flip();

    getPexels();
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

