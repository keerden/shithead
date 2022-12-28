'use strict';

exports.response = function(code, data, message = null){
    let result = {statusCode: code};
    if(data !== null){
        result.data = data;
    }
    if(message !== null){
        result.message = message;
    }
    return result;
}

exports.ok = function(data = null){
    return exports.response(200, data);
}

exports.badRequest = function(msg = "Bad Request"){
    return exports.response(400, null, msg);
}

exports.forbidden = function(msg = "Forbidden"){
    return exports.response(403, null, msg);
}

exports.serverError = function() {
    return exports.response(500, null, "Internal server error");
}