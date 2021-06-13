var mongoose = require('mongoose');
var Movie = require('./models/movies');
var Admin = require('./models/admin');
var Comment = require('./models/comment');
const { text } = require('body-parser');

var movieData = [
    {
        name: "Howl's moving castle",
        image: "https://www.metalbridges.com/wp-content/uploads/2015/08/Howls-Moving-Castle-10.jpg",
        type: "Fantacy",
        time: "110",
        language: ["ENG","TH"],
        URL:'https://www.youtube.com/embed/iwROgK94zcM'
    },
    {
        name: "Ponyo",
        image: "https://i.pinimg.com/originals/67/fb/bd/67fbbd4ac59f8c7d7b083c78a5433fad.jpg",
        type: "Fantacy",
        time: "110",
        language: ["ENG","TH"],
        URL:'https://www.youtube.com/embed/CsR3KVgBzSM'
    },
    {
        name: "Spirit Away",
        image: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        type: "Fantacy",
        time: "110",
        language: ["ENG","TH"],
        URL:'https://www.youtube.com/embed/ByXuk9QqQkk'
    },
    {
        name: "Totoro",
        image: "https://spoileralert7blog.files.wordpress.com/2016/01/8icxrwcatkkxhzdmgibliq.jpg",
        type: "Fantacy",
        time: "110",
        language: ["ENG","TH"],
        URL:'https://www.youtube.com/embed/92a7Hj0ijLs'
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