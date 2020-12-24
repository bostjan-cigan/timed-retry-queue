"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimedRetryQueueTasks = /** @class */ (function () {
    function TimedRetryQueueTasks() {
        this.queue = {};
        this.queueSize = 0;
        this.current = 1;
    }
    TimedRetryQueueTasks.prototype.add = function (task) {
        var size = ++this.queueSize;
        this.queue[size] = task;
    };
    TimedRetryQueueTasks.prototype.addMany = function (tasks) {
        var _this = this;
        tasks.forEach(function (task) {
            _this.add(task);
        });
    };
    TimedRetryQueueTasks.prototype.isEmpty = function () {
        return this.queueSize === 0;
    };
    TimedRetryQueueTasks.prototype.getNext = function () {
        if (this.queueSize > 0) {
            var task = this.queue[this.current];
            delete this.queue[this.current];
            this.queueSize--;
            ++this.current;
            return task;
        }
    };
    TimedRetryQueueTasks.prototype.empty = function () {
        for (var property in this.queue) {
            delete this.queue[property];
        }
        this.queueSize = 0;
        this.current = 1;
    };
    TimedRetryQueueTasks.prototype.size = function () {
        return this.queueSize;
    };
    return TimedRetryQueueTasks;
}());
exports.default = TimedRetryQueueTasks;
