"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var timestring_1 = __importDefault(require("timestring"));
var types_1 = require("./types");
var TimedRetryQueue = /** @class */ (function () {
    function TimedRetryQueue(options) {
        if (options === void 0) { options = {}; }
        this.defaultRetries = 1;
        this.passCurrentResults = false;
        this.parseOptions(options);
    }
    /**
     * Process queue.
     */
    TimedRetryQueue.prototype.process = function (queue) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var processResults, runExecutionLoop, task, tries, taskArgs, result;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        processResults = [];
                        runExecutionLoop = true;
                        _d.label = 1;
                    case 1:
                        if (!runExecutionLoop) return [3 /*break*/, 9];
                        task = queue.getNextTask();
                        if (!task) return [3 /*break*/, 7];
                        tries = this.defaultRetries;
                        if ((_a = task.parameters) === null || _a === void 0 ? void 0 : _a.retries) {
                            if (task.parameters.retries === -1) {
                                tries = Number.MAX_SAFE_INTEGER;
                            }
                            else {
                                tries = task.parameters.retries;
                            }
                        }
                        if (!((_b = task.parameters) === null || _b === void 0 ? void 0 : _b.onTaskStart)) return [3 /*break*/, 3];
                        return [4 /*yield*/, task.parameters.onTaskStart.call(this, __spreadArrays(processResults))];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        taskArgs = this.getTaskArguments(task, processResults);
                        return [4 /*yield*/, this.executeTask(task, tries, taskArgs, true)];
                    case 4:
                        result = _d.sent();
                        processResults.push(result);
                        if (!((_c = task.parameters) === null || _c === void 0 ? void 0 : _c.onTaskComplete)) return [3 /*break*/, 6];
                        return [4 /*yield*/, task.parameters.onTaskComplete.call(this, result, __spreadArrays(processResults))];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        runExecutionLoop = false;
                        queue.empty();
                        _d.label = 8;
                    case 8: return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, processResults];
                }
            });
        });
    };
    /**
     * Fetch options of TimedQueue.
     */
    TimedRetryQueue.prototype.getOptions = function () {
        return {
            defaultRetries: this.defaultRetries,
            passCurrentResults: this.passCurrentResults
        };
    };
    /**
     * Get task arguments.
     *
     * @param task				Task to be executed.
     * @param processResults 	Current queue results.
     */
    TimedRetryQueue.prototype.getTaskArguments = function (task, processResults) {
        var _a, _b;
        var args = [];
        if (task.args) {
            args.push.apply(args, task.args);
        }
        if (((_a = task.parameters) === null || _a === void 0 ? void 0 : _a.passResultFromPrevious) && processResults.length > 0) {
            args.push(processResults[processResults.length - 1]);
        }
        if (this.passCurrentResults || ((_b = task.parameters) === null || _b === void 0 ? void 0 : _b.passCurrentResults)) {
            args.push(__spreadArrays(processResults));
        }
        return args;
    };
    /**
     * Parse options that are passed in.
     *
     * @param options
     */
    TimedRetryQueue.prototype.parseOptions = function (options) {
        if (options.defaultRetries) {
            this.defaultRetries = options.defaultRetries;
        }
        if (options.passCurrentResults) {
            this.passCurrentResults = options.passCurrentResults;
        }
        if (options.default_retries) {
            console.warn("WARNING: Option default_retries will be deprecated in next minor version. Please use defaultRetries instead.");
            this.defaultRetries = options.default_retries;
        }
    };
    /**
     * Tries to execute task within a timeout limit.
     *
     * @param task	  			  Task that will be executed.
     * @param firstExecution	  Boolean if task is executed for the first time.
     * @param taskArgs	  		  The task arguments.
     */
    TimedRetryQueue.prototype.executeTry = function (task, firstExecution, taskArgs) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var interval;
            var _this = this;
            return __generator(this, function (_b) {
                interval = 0;
                if (((_a = task.parameters) === null || _a === void 0 ? void 0 : _a.interval) && !firstExecution) {
                    interval = timestring_1.default(task.parameters.interval, 'ms');
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, err_1;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, (_a = task.task).call.apply(_a, __spreadArrays([this], taskArgs))];
                                    case 1:
                                        result = _b.sent();
                                        resolve(result);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_1 = _b.sent();
                                        reject(types_1.TaskStatus.FAIL);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, interval);
                    })];
            });
        });
    };
    /**
     * Executes task retryer.
     *
     * @param task			 Task that will be executed.
     * @param limit 		 Limited number of times of execution (fails).
     * @param taskArgs 		 Current task arguments.
     * @param first			 Is it the first execution (used for setTimeout).
     */
    TimedRetryQueue.prototype.executeTask = function (task, limit, taskArgs, first) {
        var _a, _b;
        if (first === void 0) { first = false; }
        return __awaiter(this, void 0, void 0, function () {
            var result, taskSuccess;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(limit > 0)) return [3 /*break*/, 4];
                        if ((_a = task.parameters) === null || _a === void 0 ? void 0 : _a.onTryStart) {
                            task.parameters.onTryStart.call(this);
                        }
                        return [4 /*yield*/, this.executeTry(task, first, taskArgs).catch(function (e) { return e; })];
                    case 1:
                        result = _c.sent();
                        if ((_b = task.parameters) === null || _b === void 0 ? void 0 : _b.onTryComplete) {
                            taskSuccess = result === types_1.TaskStatus.FAIL ? false : true;
                            task.parameters.onTryComplete.call(this, taskSuccess);
                        }
                        if (!(result == types_1.TaskStatus.FAIL)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.executeTask(task, limit - 1, taskArgs)];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3: return [2 /*return*/, result];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return TimedRetryQueue;
}());
exports.default = TimedRetryQueue;
