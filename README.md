
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

TODO: param also the origin (protocol+domain+port) part with some defaults

Then:

``` Shell
$ docker run --rm -it -p 9907:9907 koddo/browser-console-logger
```

Or `-p [your_port]:9907`.

Or just run the python code.
TODO: use cli params

# Misc

You can test it with `curl`:

``` Shell
$ curl -X POST \\
       -H "Content-Type: text/plain" http://localhost:9907/browser-console-logger \\
       --data "hello world"
```

9907 is LOGG upside down, leetspeak.

TODO: add a nginx example conf to have an app and the logger on the same port
TODO: maybe later write a websockets app
