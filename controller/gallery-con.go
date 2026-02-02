package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"project/shalomB/model"
)

func (web *Tm) GalleryCreate(w http.ResponseWriter, r *http.Request) {
	var req model.Wservice
	Inst := model.NewService()
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		//log.Println("Server Starting")
		return
	}
	InstRes := Inst.CreateService(req)
	data, err := json.Marshal(InstRes)
	if err != nil {
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
func (web *Tm) GalleryAll(w http.ResponseWriter, r *http.Request) {
	var InstRes []model.Service
	Inst := model.NewService()

	InstRes = Inst.SelectAllService()
	data, err := json.Marshal(InstRes)
	if err != nil {
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
func (web *Tm) GalleryRemove(w http.ResponseWriter, r *http.Request) {
	var req model.Wservice
	Inst := model.NewService()
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		//log.Println("Server Starting")
		return
	}
	InstRes := Inst.DeleteService(req.Id)
	data, err := json.Marshal(InstRes)
	if err != nil {
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
func (web *Tm) GalleryModified(w http.ResponseWriter, r *http.Request) {
	var req model.Wservice
	Inst := model.NewService()
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		//log.Println("Server Starting")
		return
	}
	InstRes := Inst.UpdateService(req)
	data, err := json.Marshal(InstRes)
	if err != nil {
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
