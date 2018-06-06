package main

import (
	"os"
	"fmt"

	"database/sql"

	_ "github.com/lib/pq"

	"github.com/kelda/hotrod/services/customer"
)

var customers = []customer.Customer{
	{
		ID:       "123",
		Name:     "Rachel's Floral Designs",
		Location: "115,277",
	}, {
		ID:       "567",
		Name:     "Amazing Coffee Roasters",
		Location: "211,653",
	}, {
		ID:       "392",
		Name:     "Trom Chocolatier",
		Location: "577,322",
	}, {
		ID:       "731",
		Name:     "Japanese Deserts",
		Location: "728,326",
	},
}

func main() {
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASS")
	host := os.Getenv("HOTROD_POSTGRESQL_SERVICE_HOST")
	port := os.Getenv("HOTROD_POSTGRESQL_SERVICE_PORT")
	connectStr := fmt.Sprintf("postgres://%s:%s@%s:%s?sslmode=disable", user, password, host, port)

	db, err := sql.Open("postgres", connectStr)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	db.Exec("CREATE DATABASE customers")
	// Ignore errors (like if cannot connect, database already exists, etc) until next panic

	connectStr = fmt.Sprintf("postgres://%s:%s@%s:%s/customers?sslmode=disable", user, password, host, port)
	db, err = sql.Open("postgres", connectStr)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	_, err = db.Exec("DROP TABLE IF EXISTS customers")

	_, err = db.Exec(`CREATE TABLE customers (
	id varchar(8) PRIMARY KEY,
	name varchar(64),
	location varchar(16)
	)`)
	if err != nil {
		panic(err)
	}

	for _, customer := range customers {
		_, err = db.Exec("INSERT INTO customers VALUES ($1, $2, $3)",
			customer.ID, customer.Name, customer.Location)
		if err != nil {
			panic(err)
		}
	}
}
