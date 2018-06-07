package main

import (
	"fmt"
	"math/rand"
	"os"

	"github.com/go-redis/redis"

	"github.com/kelda/hotrod/services/driver"
)

func main() {
	redisHost := "hotrod-redis-master"
	redisPort := os.Getenv("HOTROD_REDIS_MASTER_SERVICE_PORT")
	url := redisHost + ":" + redisPort
	if os.Getenv("REDIS_URL") != "REDIS_URL_VALUE" {
		url = os.Getenv("REDIS_URL")
	}
	redisPass := os.Getenv("REDIS_PASS")
	if redisPass == "REDIS_PASS_VALUE" {
		redisPass = ""
	}

	client := redis.NewClient(&redis.Options{
		Addr: url,
		Password: redisPass,
	})

	var drivers []driver.Driver
	for i := 0; i < 50; i++ {
		drivers = append(drivers, driver.Driver{
			DriverID: fmt.Sprintf("T7%05dC", rand.Int()%100000),
			Location: fmt.Sprintf("%d,%d", rand.Int()%1000, rand.Int()%1000),
		})
	}

	for _, driver := range drivers {
		if err := client.Set(driver.DriverID, driver.Location, 0).Err(); err != nil {
			panic(err)
		}
	}
}
