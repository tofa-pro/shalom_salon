package controller

import (
	"html/template"
	"net/http"
)

type Tm struct {
	Tmp *template.Template
}

func StartM(t *template.Template) *Tm {
	return &Tm{
		Tmp: t,
	}
}
func (web *Tm) IndexHandler(w http.ResponseWriter, r *http.Request) {
	err := web.Tmp.ExecuteTemplate(w, "admin2.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func (web *Tm) AdminHandler(w http.ResponseWriter, r *http.Request) {
	err := web.Tmp.ExecuteTemplate(w, "admin.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
