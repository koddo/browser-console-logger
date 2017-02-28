
# Why?

Because mobile.

It's so inconvenient to use xcode or adb and a wire to get browser logs.
So we just decorate `console.log()` to make it send a post requests to our server containing the messages.


# Setup

Add this to your `index.html`:

``` HTML
<script src="https://rawgit.com/koddo/browser-console-logger/master/browser-console-logger.js"
        port="9907"
        path="/browser-console-logger"></script>
```

Then:

``` Shell
$ docker run --rm -it -p 9907:9907 koddo/browser-console-logger
```


# Misc

You can test it with `curl`:

``` Shell
$ curl -X POST -H "Content-Type: text/plain" http://localhost:9907/browser_console_logger --data "hello world"
```


TODO: maybe later write a websockets app
