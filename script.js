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

    //===================================================================================
    // gets the APIs for the topic user chose
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

    // sets all the values needed to 
    // start up the game
    function setGame() {
        // user's chosen difficulty
        difficulty = $("#difficulty").val();

        // user's chosen topic
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

    // hide everything on the page and display
    // the nav, game container, score, and timer 
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
        var leaderBoard = $("#leaderboardRows");
        leaderBoard.empty();
        let j = 0;

        for (var i in rankings) {
            j++;
            var entry = rankings[i];
            var name = entry.name;
            var score = entry.score;

            var newTag = $("<tr>");
            var newTagUserrank = $("<td>").text(j);
            var newTagUsername = $("<td>").text(name);
            var newTagUserscore = $("<td>").text(score);
            // if (currentUser === name) {
            //     newTag.css("background-color", "rgba(46, 139, 86, 0.8)")
            // }
            newTag.append(newTagUserrank, newTagUsername, newTagUserscore);
            leaderBoard.append(newTag);

        }
    }

    // reset all values so it's ready
    // for when the game is played again
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

    // load landing page coming from game or leaderboard
    function loadLanding() {
        reset();
        $("#leaderboard").addClass("hide");
        $("nav").addClass("hide");
        $("#hof").removeClass("hide");
        $("#landing").removeClass("hide");
    }

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

    function checkCardSelection() {
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
    }

    // loads end page and displays their final score
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
        // starts timer and displays the time every second
        var timerInterval = setInterval(function () {
            timer--;
            $("#timer").text(timer);

            // if the user exits midgame back to the landing
            // clear the timer
            if ($("#game").hasClass("hide")) {
                clearInterval(timerInterval);
            }
            else if (timer === 0 || matchesLeft === 0) {
                clearInterval(timerInterval);
                loadEndPage();
            }
        }, 1000);
    }

    // makes a new card in the grid
    function makeCard(newRow, pos) {
        var col = $(`<div class='col ${boardType}'>`);
        var card = $("<div class='card'>");
        var cardFront = $("<div class='front'>");
        var cardBack = $("<div class='back card-image'>");
        var newImg = $(`<img src="${photoArray[pos]}" alt="card pic">`);
        cardBack.append(newImg);
        card.append(cardFront, cardBack);
        col.append(card);
        newRow.append(col);
        $(card).flip({
            trigger: 'manual'
        });
    }

    // display the right amount of rows and colmumns 
    // filled with cards
    function makeGameBoard() {
        // keep position in photoArray
        var pos = 0;

        // for each row create all the cards, and
        // then append it to the cardsContainer
        for (var i = 0; i < numRows; i++) {
            var newRow = $("<div class='row cardRow'>");
            for (var j = 0; j < numCols; j++) {
                makeCard(newRow, pos);
                pos++;
            }
            $("#cardsContainer").append(newRow);
        }

        // timer for the overlay countdown, starts
        // as soon as the game board has been loaded
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

    // shuffles the URLs in the array so that the 
    // matching pictures aren't next to each other
    function shuffleArray(array) {
        // goes through each element in the array
        // and randomly switches it's place
        // with another element
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }

    //====================================== API CALLS =========================================
    function getCat(numCards) {
        catUrl = "https://api.thecatapi.com/v1/images/search?limit=15&apikey=5767aba7-30b0-4677-a169-9bd06be152b8";

        $.ajax({
            url: catUrl,
            method: "GET"
        }).then(function (response) {
            // since the cards come in pairs, only need to get
            // pictures for half the number of cards and
            // push it twice into the array
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

    //save data to local storage
    function saveScore(entry) {
        if (localStorage["frustration-lb"]) {
            var existingLocalStorage = localStorage.getItem("frustration-lb")
            console.log(existingLocalStorage)
            var structuredData = JSON.parse(existingLocalStorage)
            structuredData.push(entry)
            var str = JSON.stringify(structuredData);
            localStorage.setItem("frustration-lb", str)
        } else {
            var str = JSON.stringify([entry]);
            localStorage.setItem("frustration-lb", str);
        }
    }

    function addScore(score) {
        // gets user input for name
        var currentUser = $("#name").val();
        var entry = new Entry(currentUser, score);
        saveScore(entry);

        //Generate data structure to be saved to local Storage
        function Entry(currentUser, score) {
            this.name = currentUser;
            this.score = score;
        }
    }

    function getLeaderboad() {
        var str = localStorage.getItem("frustration-lb");
        rankings = JSON.parse(str);
        if (!rankings) {
            rankings = []
        }

        function dynamicSort(property) {
            var sortOrder = -1;
            if (property[0] === "-") {
                sortOrder = 1;
                property = property.substr(1);
            }
            return function (a, b) {

                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }
        rankings.sort(dynamicSort("score"))
        rankings.length = 10
    }

    //======================= EVENT LISTENERS =========================
    $(document).on("click", ".card", checkCardSelection);
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

    $("#submit").click(function () {
        // gets user input for name
        addScore(score);
        getLeaderboad();

        // var user = $("#name").val();
        // var currentUser = $("#name").val();
        // currentScore = score;
        // addNewTodoWithName(currentUser, currentScore);

        // //Generate data structure to be saved to local Storage
        // function addNewTodoWithName(name, score) {
        //     var todo = new Todo(name, score);
        //     saveTodos(todo);

        //     function Todo(name, score) {
        //         this.name = name;
        //         this.complete = score;
        //     }
        // }

        // //save data to local storage

        // function saveTodos(todo) {
        //     if (localStorage["todos"]) {
        //         var existingLocalStorage = localStorage.getItem("todos")
        //         console.log(existingLocalStorage)
        //         var structuredData = JSON.parse(existingLocalStorage)
        //         structuredData.push(todo)
        //         var str = JSON.stringify(structuredData);
        //         localStorage.setItem("todos", str)
        //     } else {
        //         var str = JSON.stringify([todo]);
        //         localStorage.setItem("todos", str);
        //     }
        // }
        // //add new Todo

        // getTodos();
        

        // function getTodos() {
        //     var str = localStorage.getItem("todos");
        //     todos = JSON.parse(str);
        //     if (!todos) {
        //         todos = []
        //     }

        //     function dynamicSort(property) {
        //         var sortOrder = -1;
        //         if (property[0] === "-") {
        //             sortOrder = 1;
        //             property = property.substr(1);
        //         }
        //         return function (a, b) {

        //             var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        //             return result * sortOrder;
        //         }
        //     }
        //     todos.sort(dynamicSort("complete"))
        //     todos.length = 10
        // }


        // listTodos();
        loadLeaderboard();

        // function listTodos() {
        //     var leaderBoard = $("#leaderboardRows");
        //     leaderBoard.empty();
        //     let j = 0;

        //     // sort todos here


        //     for (var i in todos) {
        //         j++;
        //         var todo = todos[i];
        //         var name = todo.name;
        //         var completed = todo.complete;

        //         var newTag = $("<tr>");
        //         var newTagUserrank = $("<td>").text(j);
        //         var newTagUsername = $("<td>").text(name);
        //         var newTagUserscore = $("<td>").text(completed);
        //         // if (currentUser === name) {
        //         //     newTag.css("background-color", "rgba(46, 139, 86, 0.8)")
        //         // }
        //         newTag.append(newTagUserrank, newTagUsername, newTagUserscore);
        //         leaderBoard.append(newTag);

        //     }


        // }



        $("#end").addClass("hide");
        $("#leaderboard").removeClass("hide");
        $("#lbOptionsRow").addClass("hide");
        // loadLeaderboard();
    });

    $("#hof").click(function () {
        $("#landing").addClass("hide");
        $("#leaderboard").removeClass("hide");
        $("#lbOptionsRow").removeClass("hide");
        loadLeaderboard();
    });
});