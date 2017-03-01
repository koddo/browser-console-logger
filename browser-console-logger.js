// TODO: same for info, warn, error, assert, etc --- http://tobyho.com/2012/07/27/taking-over-console-log/, https://developer.mozilla.org/en-US/docs/Web/API/Console
(function(console) {    // make console.log send a POST request containing the message
    if (!console)
        return;

    var origin = window.location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    var currentScript = document.currentScript || (function() {    // http://stackoverflow.com/questions/5292372/how-to-pass-parameters-to-a-script-tag/32589923#32589923
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    var logger_link = document.createElement('a');
    logger_link.href = origin;
    logger_link.port = currentScript.getAttribute('port');
    logger_link.pathname = currentScript.getAttribute('path');

    
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
            var xhr = new XMLHttpRequest();   // yes, I've checked, we don't have or need to reuse this
            xhr.open("POST", logger_link, true);
            xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            arguments_object_converted_to_array = Array.prototype.slice.call(arguments);      // http://stackoverflow.com/questions/960866/how-can-i-convert-the-arguments-object-to-an-array-in-javascript
            xhr.send(method + ": " + "".concat.apply(arguments_object_converted_to_array));
            return res;
        }
    };
    ['log', 'warn', 'debug', 'info', 'assert', 'error', 'count'].forEach(function(method) {
        intercept(method);
    });
    
}(window.console));

window.onerror = function(msg, url, line, col, err) {
    var stacktrace = "";
    if (typeof err !== 'undefined' && err !== null) {   // ios8 has this undefined
        stacktrace = ", stacktrace: " + err.stack;
    }
    console.error(msg + ", " + url + ", " + line + ", " + col + stacktrace);
};
