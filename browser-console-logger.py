#!/usr/bin/env python2.7

from flask import Flask
from flask import request
import logging
import os
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)                # = Access-Control-Allow-Origin: *


## lets make it not log this:
## 172.17.0.1 - - [19/Dec/2015 18:40:45] "POST /browser_console_logger HTTP/1.1" 204 -
log = logging.getLogger('werkzeug')   # http://stackoverflow.com/questions/14888799/disable-console-messages-in-flask-server
log.setLevel(logging.ERROR)


app.logger.addHandler(logging.StreamHandler())
app.logger.setLevel(logging.INFO)



### currently logs to sdtout only, (maybe later) add a rotated log file

@app.route('/browser-console-logger', methods=['POST'])
def hello_world():
    l = request.data.decode(encoding="utf-8", errors="replace")
    app.logger.info("%s" % (l))
    return ('', 204)


if __name__ == '__main__':
    print(os.path.basename(__file__) + " running...")
    app.run(host='0.0.0.0', port=9907,
            threaded=True)

    
