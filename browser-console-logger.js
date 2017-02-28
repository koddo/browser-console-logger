// TODO: same for info, warn, error, assert, etc --- http://tobyho.com/2012/07/27/taking-over-console-log/, https://developer.mozilla.org/en-US/docs/Web/API/Console
(function(proxied) {    // make console.log send a POST request containing the message
    if (!window.location.origin) {   // fix for older browsers
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    document.currentScript = document.currentScript || (function() {    // http://stackoverflow.com/questions/5292372/how-to-pass-parameters-to-a-script-tag/32589923#32589923
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    var logger_link = document.createElement('a');
    logger_link.href = window.location.origin;
    logger_link.port = document.currentScript.getAttribute('port');
    logger_link.pathname = document.currentScript.getAttribute('path');
    console.log = function() {
        var xhr = new XMLHttpRequest();   // yes, I've checked, we don't have or need to reuse this
        xhr.open("POST", logger_link, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        arguments_object_converted_to_array = Array.prototype.slice.call(arguments);      // http://stackoverflow.com/questions/960866/how-can-i-convert-the-arguments-object-to-an-array-in-javascript
        xhr.send("".concat.apply(arguments_object_converted_to_array));
        return proxied.apply(this, arguments);
    };
})(console.log);

// the following snippet didn't work in ios8, so we don't use it, maybe try it again later:
// window.addEventListener("error", function (e) { ... } );
window.onerror = function(msg, url, line, col, err) {
    var stacktrace = "";                                                    
    if (typeof err !== 'undefined' && err !== null) {   // ios8 has this undefined
        stacktrace = ", stacktrace: " + err.stack;                                                    
    }
    console.log("error: " + msg + ", " + url + ", " + line + ", " + col + stacktrace);
};

// console.log("browser_console_logger ok");
// console.warn("browser_console_logger_error_warn ok");
