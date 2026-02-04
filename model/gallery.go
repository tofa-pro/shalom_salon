package model

import (
	"database/sql"
	"fmt"
	"project/shalomB/config"
)

type Wgallery struct {
	Id             int    `json:"id"`
	ImgTitle       string `json:"imgtitle"`
	Catagory       string `json:"catagory"`
	ImgDescription string `json:"imgdescription"`
	ImgPath        string `json:"imgpath"`
}
type Gallery struct {
	Id             int
	ImgTitle       sql.NullString
	Catagory       sql.NullString
	ImgDescription sql.NullString
	ImgPath        sql.NullString
}
type Wgallerys struct {
	Conn     *config.Conn
	Wservice *Wgallery
}

func NewGallery() *Wgallerys {
	return &Wgallerys{
		Conn: config.Connect(),
	}
}
func (in *Wgallerys) CreateGallery(req Wgallery) int64 {
	var ins *sql.Stmt
	db = in.Conn.GetDB()
	defer db.Close()
	ins, err := db.Prepare("INSERT INTO `shalomB`.`gallery` (`imgtitle`,`catagory`,`imgdescription`,`imgpath`) VALUES (?,?,?,?);")
	if err != nil {
		panic(err)
	}
	defer ins.Close()

	var res sql.Result
	res, err = ins.Exec(req.ImgTitle, req.Catagory, req.ImgDescription, req.ImgPath)

	rowAffec, _ := res.RowsAffected()
	if err != nil || rowAffec != 1 {
		panic(err)
	}
	return rowAffec
}

func (in *Wgallerys) SelectAllGallery() []Gallery {
	stmt := "SELECT * FROM gallery"
	db = in.Conn.GetDB()
	defer db.Close()
	rows, err := db.Query(stmt)
	if err != nil {
		panic(err)
	}

	//defer rows.Close()
	var products []Gallery
	for rows.Next() {
		var p Gallery
		err = rows.Scan(&p.Id, &p.ImgTitle, &p.Catagory, &p.ImgDescription, &p.ImgPath)
		if err != nil {
			panic(err)
		}

		products = append(products, p)
	}
	return products
}
func (in *Wgallerys) DeleteGallery(id int) int64 {
	db = in.Conn.GetDB()
	defer db.Close()
	del, err := db.Prepare("DELETE FROM `shalomB`.`gallery` WHERE (`id` = ?);")
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
func (in *Wgallerys) UpdateGallery(req Wgallery) int64 {
	upStmt := "UPDATE `shalomB`.`gallery` SET `imgtitle`= ?,`catagory`= ?,`imgdescription`= ?,`imgpath`= ? WHERE (`id` = ?);"
	db = in.Conn.GetDB()
	defer db.Close()
	stmt, err := db.Prepare(upStmt)
	if err != nil {
		panic(err)
	}
	defer stmt.Close()
	var res sql.Result

	res, err = stmt.Exec(req.ImgTitle, req.Catagory, req.ImgDescription, req.ImgPath, req.Id)

	rowsAff, _ := res.RowsAffected()
	if err != nil || rowsAff != 1 {
		panic(err)
	}
	return rowsAff
}
