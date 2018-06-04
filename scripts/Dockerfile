FROM willwangkelda/hotrod:latest

WORKDIR /go/src/github.com/kelda/hotrod/scripts

COPY seed_postgres/ seed_postgres/
COPY seed_redis/ seed_redis/
COPY Makefile Makefile

ENTRYPOINT ["make", "seed"]