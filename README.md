#EnrichStream

A stream that provides asynchronous enrichment of data and guarantees FIFO ordering.

##Implementation
Enrichment is asynchronous.
Concurrency is controlled via [async.queue](https://github.com/caolan/async).
Stream writes are buffered until enrichment has completed.


##Use
Given **Future Improvements** the current best use cases are where enrichment is expected to be relatively fast.


##Running Tests
Run `node test` to send a stream of values for enrichment that are checked for being output in order.


##Future Improvements
*Better buffering
*Optimize draining



