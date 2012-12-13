#EnrichStream

A stream that enables asynchronous enrichment of data with concurrency control while preserving FIFO ordering.

##Implementation
* Enrichment is asynchronous.
* Concurrency is controlled via [async.queue](https://github.com/caolan/async).
* Stream writes are buffered until enrichment has completed.


##Use Cases
Given that enrichment likely takes time which requires buffering the current best use cases are where enrichment is expected to be relatively fast.
Use a [control stream](https://github.com/substack/stream-handbook#control-streams) or other mechanism to tune performance as a pre/post step.


##Running Tests
Run `node test` to send a stream of values for enrichment that are checked for being output in order.




