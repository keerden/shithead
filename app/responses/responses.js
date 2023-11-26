'use strict';

exports.response = function(req, res, statusCode, data, message = null){
    if(data === null){
        data = {message: message};
    }

    res.status(statusCode).json(data);
}

exports.ok = function(req, res, data = null){
    return exports.response(req, res, 200, data);
}

exports.badRequest = function(req, res){
    return exports.response(req, res, 400, null, "Bad Request");
}

exports.forbidden = function(req, res){
    return exports.response(req, res, 403, null, "Forbidden");
}

exports.serverError = function(req, res) {
    return exports.response(req, res, 500, null, "Internal server error");
}

exports.methodNotAllowed = function(req, res) {
    return exports.response(req, res, 405, null, "Method not allowed");
}

exports.endpointNotFound = function(req, res) {
    return exports.response(req, res, 404, null, "Endpoint not found");
}

exports.running = function(req, res){
    return exports.ok(req, res, {status: "running"});
}