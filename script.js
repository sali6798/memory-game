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