// inspired by http://tobyho.com/2012/07/27/taking-over-console-log/
// see also https://developer.mozilla.org/en-US/docs/Web/API/Console

(function() {
    console = window.console;   // to avoid dom lookup on every function call
    if (!console)
        return;

    var origin = window.location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    var currentScript = document.currentScript || (function() {    // http://stackoverflow.com/questions/5292372/how-to-pass-parameters-to-a-script-tag/32589923#32589923
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    var logger_link = document.createElement('a');   // let's use built-in url parser
    logger_link.href = origin;
    logger_link.port = currentScript.getAttribute('port');
    logger_link.pathname = currentScript.getAttribute('path');

    var original_console_log = console.log;
    function xhr_send(link, msg) {
        var xhr = new XMLHttpRequest();   // yes, I've checked, we don't have or need to reuse this
        xhr.open("POST", link, true);
        xhr.onerror = function () { original_console_log("browser-console-logger: post request to backend failed"); };
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        xhr.send(msg);
        // TODO: check for http errors
    }
    
    function intercept(method) {
        var original = console[method];
        console[method] = function() {
            var res;
            if (original.apply) {
                res = original.apply(console, arguments);
            } else {  // IE
                var message = Array.prototype.slice.apply(arguments).join(' ');
                res = original(message);
            }
            var arguments_object_converted_to_array = Array.prototype.slice.call(arguments);      // http://stackoverflow.com/questions/960866/how-can-i-convert-the-arguments-object-to-an-array-in-javascript
            var msg =  "(" + method + ") " + "".concat.apply(arguments_object_converted_to_array);
            xhr_send(logger_link, msg);
            return res;
        }
    };
    
    ['log', 'warn', 'debug', 'info', 'assert', 'error', 'count'].forEach( function(method) {
        intercept(method);
    });

    var original_onerror = window.onerror;
    window.onerror = function(msg, url, line, col, err) {
        var res = null;
        if(original_onerror) {
            res = original_onerror(msg, url, line, col, err);
        }
        var stacktrace = "";
        if (typeof err !== 'undefined' && err !== null) {   // iOS Safari has err undefined
            stacktrace = ", stacktrace: " + err.stack;
        }
        xhr_send(logger_link, "(window.onerror) " + msg + ", " + url + ", " + line + ", " + col + stacktrace);
        return res;
    };

    function mySimpleStringify(object) {
        var simpleObject = {};
        for (var prop in object) {
            if (typeof(object[prop]) == 'object'){
                simpleObject[prop] = "{...}";
            } else if (typeof(object[prop]) == 'function'){
                simpleObject[prop] = "(function)";
            } else {
                simpleObject[prop] = object[prop];
            }
        }
        return JSON.stringify(simpleObject, null, 4);
    };
    window.addEventListener('error', function(e) {
        // dumps the whole e.target, too verbose and doesn't give reason (like 404)
        // TODO: better message on error event
        xhr_send(logger_link, "(error event) e.target = " + mySimpleStringify(e.target));
    }, true);
    
}());

