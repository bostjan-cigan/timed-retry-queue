"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimedRetryQueueTasks = /** @class */ (function () {
    function TimedRetryQueueTasks() {
        this.queue = {};
        this.start = -1;
        this.end = -1;
    }
    TimedRetryQueueTasks.prototype.add = function (task) {
        this.enqueue(task);
    };
    TimedRetryQueueTasks.prototype.addMany = function (tasks) {
        var _this = this;
        tasks.forEach(function (task) {
            _this.enqueue(task);
        });
    };
    TimedRetryQueueTasks.prototype.isEmpty = function () {
        return this.size() === 0;
    };
    TimedRetryQueueTasks.prototype.getNextTask = function () {
        return this.dequeue();
    };
    TimedRetryQueueTasks.prototype.empty = function () {
        for (var property in this.queue) {
            delete this.queue[property];
        }
        this.start = -1;
        this.end = -1;
    };
    TimedRetryQueueTasks.prototype.size = function () {
        return this.end - this.start;
    };
    TimedRetryQueueTasks.prototype.enqueue = function (task) {
        this.queue[++this.end] = task;
    };
    TimedRetryQueueTasks.prototype.dequeue = function () {
        if (this.size() > 0) {
            var next = this.queue[++this.start];
            delete this.queue[this.start];
            return next;
        }
        return undefined;
    };
    return TimedRetryQueueTasks;
}());
exports.default = TimedRetryQueueTasks;
