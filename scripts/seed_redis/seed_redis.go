package main

import (
	"fmt"
	"math/rand"
	"os"

	"github.com/go-redis/redis"

)

func main() {
	url := os.Getenv("REDIS_URL")
	redisPass := os.Getenv("REDIS_PASS")
	if redisPass == "REDIS_PASS_VALUE" {
		redisPass = ""
	}

	client := redis.NewClient(&redis.Options{
		Addr: url,
		Password: redisPass,
	})

	for i := 0; i < 50; i++ {
		if err := client.Set(
			fmt.Sprintf("T7%05dC", rand.Int()%100000),
			fmt.Sprintf("%d,%d", rand.Int()%1000, rand.Int()%1000),
			0).Err(); err != nil {
				panic(err)
		}
	}
}
