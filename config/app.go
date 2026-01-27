package config

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

type Conn struct {
	db *sql.DB
}

func Connect() *Conn {
	d, err := sql.Open("mysql", "root:Mysql@pro@123@tcp(localhost:3306)/shalomB")
	if err != nil {
		panic(err.Error())
	}
	//defer d.Close()
	return &Conn{
		db: d,
	}

}

func (u *Conn) GetDB() *sql.DB {
	return u.db
}
