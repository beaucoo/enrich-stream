#EnrichStream

A stream that enables asynchronous enrichment of data with concurrency control while preserving FIFO ordering.

##Behavior
* Enrichment is asynchronous.
* Concurrency is controlled via [async.queue](https://github.com/caolan/async).
* Stream writes are buffered until enrichment has completed.

##v1.0.0 Release Notes
v1.0.0 Breaking change: constructor parameters are re-ordered and 'shouldEnrichFunc' is now optional.

##Use Cases
Given that enrichment likely takes time which requires buffering the current best use cases are where enrichment is expected to be relatively fast.
Use a [control stream](https://github.com/substack/stream-handbook#control-streams) or other mechanism to tune performance as a pre/post step.

##Running Tests
Run `node test` to send a stream of values for enrichment that are checked for being output in order.

##License
(The MIT License)

Copyright (c) 2012-20* BeauCoo Technologies Inc. <info@beaucoo.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




