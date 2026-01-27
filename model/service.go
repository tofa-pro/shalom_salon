package model

import (
	"database/sql"
	"fmt"
	"project/shalomB/config"
)

type Wservice struct {
	Id          int `json:"id"`
	ServiceName int `json:"servicename"`
	Duration    int `json:"duration"`
	PriceRange  int `json:"pricerange"`
	Description int `json:"description"`
}
type Service struct {
	Id          int
	ServiceName sql.NullString
	Duration    sql.NullString
	PriceRange  sql.NullString
	Description sql.NullString
}
type Wservices struct {
	Conn     *config.Conn
	Wservice *Wservice
}

func NewService() *Wservices {
	return &Wservices{
		Conn: config.Connect(),
	}
}
func (in *Wservices) CreateService(req Wservice) int64 {
	var ins *sql.Stmt
	db = in.Conn.GetDB()
	defer db.Close()
	ins, err := db.Prepare("INSERT INTO `shalomB`.`service` (`servicename`,`duration`,`pricerange`,`servicedesc`) VALUES (?,?,?,?);")
	if err != nil {
		panic(err)
	}
	defer ins.Close()

	var res sql.Result
	res, err = ins.Exec(req.ServiceName, req.Duration, req.PriceRange, req.Description)

	rowAffec, _ := res.RowsAffected()
	if err != nil || rowAffec != 1 {
		panic(err)
	}
	return rowAffec
}

func (in *Wservices) SelectAllService() []Wservice {
	stmt := "SELECT * FROM service"
	db = in.Conn.GetDB()
	defer db.Close()
	rows, err := db.Query(stmt)
	if err != nil {
		panic(err)
	}

	//defer rows.Close()
	var products []Wservice
	for rows.Next() {
		var p Wservice
		err = rows.Scan(&p.Id, &p.ServiceName, &p.Duration, &p.PriceRange, &p.Description)
		if err != nil {
			panic(err)
		}

		products = append(products, p)
	}
	return products
}
func (in *Wservices) DeleteService(id int) int64 {
	db = in.Conn.GetDB()
	defer db.Close()
	del, err := db.Prepare("DELETE FROM `shalomB`.`service` WHERE (`id` = ?);")
	if err != nil {
		panic(err)
	}
	defer del.Close()
	var res sql.Result
	res, err = del.Exec(id)
	rowsAff, _ := res.RowsAffected()
	fmt.Println("rowsAff:", rowsAff)

	if err != nil || rowsAff != 1 {
		panic(err)
	}
	return rowsAff
}
func (in *Wservices) UpdateService(req Wservice) int64 {
	upStmt := "UPDATE `shalomB`.`service` SET `servicename`= ?,`duration`= ?,`pricerange`= ?,`servicedesc`= ? WHERE (`id` = ?);"
	db = in.Conn.GetDB()
	defer db.Close()
	stmt, err := db.Prepare(upStmt)
	if err != nil {
		panic(err)
	}
	defer stmt.Close()
	var res sql.Result

	res, err = stmt.Exec(req.ServiceName, req.Duration, req.PriceRange, req.Description, req.Id)

	rowsAff, _ := res.RowsAffected()
	if err != nil || rowsAff != 1 {
		panic(err)
	}
	return rowsAff
}
