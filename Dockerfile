FROM python:2.7

RUN groupadd theuser && useradd --create-home --gid theuser --uid 1000 theuser
WORKDIR /home/theuser
ENV HOME /home/theuser
USER theuser


RUN pip install --user flask flask-cors
COPY ["browser-console-logger.py", "."]

CMD [ "python", "browser-console-logger.py" ]
