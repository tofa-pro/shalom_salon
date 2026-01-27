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
	err := web.Tmp.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
