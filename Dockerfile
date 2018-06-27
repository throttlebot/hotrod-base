FROM golang:1.8
MAINTAINER Hantao Wang

RUN mkdir -p /go/src/gitlab.com/will.wang1
RUN mkdir -p /go/bin

ADD . /go/src/gitlab.com/will.wang1/hotrod-base

WORKDIR /go/src/gitlab.com/will.wang1/hotrod-base/scripts

ENTRYPOINT ["make", "seed"]