FROM golang:1.8
MAINTAINER Hantao Wang

RUN mkdir -p /go/src/github.com/kelda-inc
RUN mkdir -p /go/bin

ADD . /go/src/github.com/kelda-inc/hotrod-base

WORKDIR /go/src/github.com/kelda-inc/hotrod-base/scripts

ENTRYPOINT ["make", "seed"]
