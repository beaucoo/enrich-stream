var EnrichStream = require("../index");
var ArrayStream = require('arraystream');
var should = require('should');


var minMs = 1;
var maxMs = 3;
var count = 1000;
var concurrency = 10;


var array = [];
for (var i = 0; i < count; i++) {
    var timeout = Math.floor((Math.random() * maxMs) + minMs);
    array.push(timeout);
}
console.log("Array length: " + array.length);


var enrichStream = new EnrichStream(function (timeout, callback) {
    setTimeout(function () {
        callback();
    }, timeout);
}, concurrency);


var outIndex = 0;
enrichStream.on('data',
    function (timeout) {
        timeout.should.equal(array[outIndex++]);
    }).on('end', function () {
        outIndex.should.equal(array.length);
    });


ArrayStream.create(array)
    .pipe(enrichStream);




