var mongoose = require('mongoose');
var Movie = require('./models/movies');
var Admin = require('./models/admin');
var Comment = require('./models/comment');
const { text } = require('body-parser');

var movieData = [
    {
        name: "Howl's moving castle",
        image: "/images/hows.jpg",
        type: "Fantacy",
        time: "110",
        language: ["ENG","TH"],
        URL:'https://www.youtube.com/embed/iwROgK94zcM',
        price:"200"
    },
    {
        name: "Ponyo",
        image: "/images/ponyo.jpg",
        type: "Fantacy",
        time: "110",
        language: ["ENG","TH"],
        URL:'https://www.youtube.com/embed/CsR3KVgBzSM',
        price:"160"
    },
    {
        name: "Spirit Away",
        image: "/images/spirit-away.jpg",
        type: "Fantacy",
        time: "110",
        language: ["ENG","TH"],
        URL:'https://www.youtube.com/embed/ByXuk9QqQkk',
        price:"200"
    },
    {
        name: "Totoro",
        image: "/images/Totoro.jpg",
        type: "Fantacy",
        time: "110",
        language: ["ENG","TH"],
        URL:'https://www.youtube.com/embed/92a7Hj0ijLs',
        price:"200"
    }
];

function seedDB() {
    Movie.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Remove database complete');
        movieData.forEach(function (seed) {
            Movie.create(seed, function (err, movies) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('New movie added');
                }
            });
        });
    });
}

module.exports = seedDB;