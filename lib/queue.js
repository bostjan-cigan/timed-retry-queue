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
        this.default_retries = 1;
        this.parseOptions(options);
    }
    /**
     * Process queue.
     */
    TimedRetryQueue.prototype.process = function (queue) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var processResults, runExecutionLoop, task, tries, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        processResults = [];
                        runExecutionLoop = true;
                        _b.label = 1;
                    case 1:
                        if (!runExecutionLoop) return [3 /*break*/, 5];
                        task = queue.getNext();
                        if (!task) return [3 /*break*/, 3];
                        tries = this.default_retries;
                        if ((_a = task.parameters) === null || _a === void 0 ? void 0 : _a.retries) {
                            tries = task.parameters.retries;
                        }
                        return [4 /*yield*/, this.executeTask(task, tries)];
                    case 2:
                        result = _b.sent();
                        processResults.push(result);
                        return [3 /*break*/, 4];
                    case 3:
                        runExecutionLoop = false;
                        queue.empty();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, processResults];
                }
            });
        });
    };
    /**
     * Fetch options of TimedQueue.
     */
    TimedRetryQueue.prototype.getOptions = function () {
        return {
            default_retries: this.default_retries
        };
    };
    /**
     * Parse options that are passed in.
     *
     * @param options
     */
    TimedRetryQueue.prototype.parseOptions = function (options) {
        if (options.default_retries) {
            this.default_retries = options.default_retries;
        }
    };
    /**
     * Tries to execute task within a timeout limit.
     *
     * @param task	  Task that will be executed.
     * @param timeout Limited number of times of execution (fails).
     */
    TimedRetryQueue.prototype.executeTry = function (task) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var args, interval;
            var _this = this;
            return __generator(this, function (_b) {
                args = task.args || [];
                interval = 0;
                if ((_a = task.parameters) === null || _a === void 0 ? void 0 : _a.interval) {
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
                                        return [4 /*yield*/, (_a = task.task).call.apply(_a, __spreadArrays([this], args))];
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
     * @param task	Task that will be executed.
     * @param limit Limited number of times of execution (fails).
     */
    TimedRetryQueue.prototype.executeTask = function (task, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(limit > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.executeTry(task).catch(function (e) { return e; })];
                    case 1:
                        result = _a.sent();
                        if (!(result == types_1.TaskStatus.FAIL)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.executeTask(task, limit - 1)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, result];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return TimedRetryQueue;
}());
exports.default = TimedRetryQueue;
