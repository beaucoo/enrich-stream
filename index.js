var Stream = require('stream');
var util = require('util');
var async = require('async');


//TODO optimize with draining


function EnrichStream(enrichFunc, enrichConcurrency) {
    "use strict";

    if (!enrichFunc) {
        enrichFunc = function (task, callback) {
            callback();
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
        return function (err) {
            if (err) {
                console.log(err);
            }

            work.done = true;
            workCompleted();
        };
    }


    this.write = function (data) {
        workCount++;
        var work = {data:data, done:false};
        buffer.push(work);
        queue.push(data, getEnrichedFunc(work));
        return true;
    };


    this.end = function (data) {
        if (data) {
            this.write(data);
        }

        endWanted = true;
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