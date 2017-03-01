
# Browser console logs in your terminal? Why?

Because mobile.

It's so inconvenient to use xcode or adb and a wire to get console logs from mobile browsers.  
So we just decorate `console.log()` et al to make it send post requests to our server containing the messages.  
Happily works inside cordova, for which it was written in the first place.

TODO: maybe later write a websockets app when simple post requests are no longer enough


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

# Misc

9907 is LOGG upside down.

You can test it with `curl`:

``` Shell
$ curl -X POST \\
       -H "Content-Type: text/plain" http://localhost:9907/browser-console-logger \\
       --data "hello world"
```

You can specify the port you want to bind with docker: `-p [your_port]:9907`.

For your `docker-compose.yml`:

```
  browser-console-logger:
    image: koddo/browser-console-logger
    ports:
      - "9907:9907"
```

Or you can just run the python code directly.  
TODO: cli params

TODO: add a nginx example conf to have an app and the logger on the same port

<https://hub.docker.com/r/koddo/browser-console-logger/>

I also found a mysterious bug: when I run the app with python 3, flask hangs occasionally. And this doesn't happen with 2.7. Hm.
