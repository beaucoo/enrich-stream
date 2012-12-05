var EnrichStream = require("../index");
var ArrayStream = require('arraystream');
var should = require('should');


var minMs = 0;
var maxMs = 10;
var count = 10000;
var concurrency = 10;


// Create test data of timeout values
var array = [];
for (var i = 0; i < count; i++) {
    var timeout = Math.floor((Math.random() * maxMs) + minMs);
    var sign = Math.floor((Math.random() * 2) + 1) === 2 ? 1 : -1;
    array.push(timeout * sign);
}
console.log("Array length: " + array.length);


// Configure enrichment stream
var enrichStream = new EnrichStream(
    function perform(timeout) {
//        console.log("%s %d", ((0 <= timeout) ? "enriched" : "skipped"), timeout);
        return (0 <= timeout);
    },
    function enrich(timeout, callback) {
        setTimeout(function () {
            callback();
        }, timeout);
    }, concurrency);


// Verify FIFO
var outIndex = 0;
enrichStream.on('data',
    function (timeout) {
        timeout.should.equal(array[outIndex++]);
    }).on('end', function () {
        outIndex.should.equal(array.length);
    });


ArrayStream.create(array)
    .pipe(enrichStream);




