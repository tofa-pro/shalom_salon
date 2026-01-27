package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"project/shalomB/controller"
)

func main() {
	//tpl, _ = template.ParseGlob("frontend/html/*.html")
	setupAPI()
	fmt.Printf("Starting server at port 8080\n")
	log.Fatal(http.ListenAndServe(":8080", nil))
	//log.Fatal(http.ListenAndServeTLS(":8080", "server.crt", "server.key", nil))
}

func setupAPI() {
	//http.Handle("/", http.FileServer(http.Dir("./frontend/html")))
	var tpl *template.Template
	var err error
	tpl, err = template.ParseGlob("static/html/*.html")
	if err != nil {
		log.Fatal(err)
	}
	Manager := controller.StartM(tpl)
	// Serve static files (CSS, JS)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.HandleFunc("/", Manager.IndexHandler)

	//Device
	http.HandleFunc("/services", Manager.ServiceAll)
	http.HandleFunc("/servicecreate", Manager.ServiceCreate)
	http.HandleFunc("/servicedelete", Manager.ServiceRemove)
	http.HandleFunc("/serviceupdate", Manager.ServiceModified)

}
