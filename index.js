var Stream = require('stream');
var util = require('util');
var async = require('async');


//
// EnrichStream v1.0.0
// BeauCoo 2012
// info@beaucoo.com
//
// A stream that enables asynchronous enrichment of data with concurrency control while preserving FIFO ordering.
//
// Controlling enrichment concurrency via https://github.com/caolan/async/#queue
// 'enrichConcurrency' - positive integer
// 'enrichFunc' - function(data, callback) { callback(null, enrichedData); } to update input data with enriched data
// 'shouldEnrichFunc' (optional) - function(data) { return true/false; } to perform/skip asynchronous enrichment.
//                      If not declared or null enrichment occurs for all items.
//
function EnrichStream(enrichConcurrency, enrichFunc, shouldEnrichFunc) {
    "use strict";

    if (!shouldEnrichFunc) {
        shouldEnrichFunc = function () {
            return true;
        };
    }

    if (!enrichFunc) {
        enrichFunc = function (data, callback) {
            callback(null, data);
        };
    }

    var self = this;
    self.writable = true;
    self.readable = true;

    var streamingOut = false;
    var endWanted = false;
    var workCount = 0;
    var completedCount = 0;
    var buffer = [];
    var queue = async.queue(enrichFunc, enrichConcurrency);
    var destroyed = false;


    function workCompleted() {
        if (streamingOut || destroyed) {
            return;
        }

        streamingOut = true;
        while (streamingOut && buffer.length && buffer[0].done) {
            self.emit('data', buffer.shift().data);
            completedCount++;
        }
        streamingOut = false;

        if (endWanted === true && completedCount === workCount) {
            self.ended = true;
            self.writable = false;
            self.emit('end');
        }
    }


    function getEnrichedFunc(work) {
        return function (err, enrichedData) {
            if (err) {
                console.log(err);
            }

            work.data = enrichedData;
            work.done = true;
            workCompleted();
        };
    }


    this.write = function (data) {
        workCount++;
        var work = {data:data, done:false};
        buffer.push(work);

        if (shouldEnrichFunc(work.data)) {
            queue.push(data, getEnrichedFunc(work));
        } else {
            work.done = true;
            workCompleted();
        }

        return true;
    };


    this.end = function (data) {
        endWanted = true;

        if (data) {
            this.write(data);
        } else {
            workCompleted(); // Flush out any remaining completed work and ensure 'end' is emitted
        }
    };


    this.destroy = function () {
        if (destroyed) {
            return;
        }

        destroyed = true;
        self.ended = true;
        self.writable = false;
        buffer.length = 0;
        self.emit('close');
    };
}


util.inherits(EnrichStream, Stream);


module.exports = EnrichStream;