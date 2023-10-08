FROM ubuntu:latest
LABEL authors="kornumic"

ENTRYPOINT ["top", "-b"]

