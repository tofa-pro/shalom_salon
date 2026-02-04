package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"project/shalomB/model"
	"time"
)

func (web *Tm) GalleryCreate(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)
	var req model.Wgallery
	Inst := model.NewGallery()
	log.Println("FORM:", r.Form)
	log.Println("FILES:", r.ParseMultipartForm(10<<20))
	err := r.ParseMultipartForm(5 << 20)
	if err != nil {
		http.Error(w, "File tooo large", http.StatusBadRequest)
		return
	}

	//Read normal form fields
	req.ImgTitle = r.FormValue("imgtitle")
	req.Catagory = r.FormValue("category")
	req.ImgDescription = r.FormValue("imgdescription")

	//Read file
	file, header, err := r.FormFile("imgpath")

	if err != nil {
		http.Error(w, "Image required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	os.MkdirAll("static/img/gallery", os.ModePerm)
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	req.ImgPath = filepath.Join("static/img/gallery", filename)

	dst, err := os.Create(req.ImgPath)

	if err != nil {
		http.Error(w, "Save failed", http.StatusInternalServerError)
		return
	}
	defer dst.Close()
	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, "Write failed", http.StatusInternalServerError)
		return
	}

	InstRes := Inst.CreateGallery(req)
	data, err := json.Marshal(InstRes)
	if err != nil {
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
func (web *Tm) GalleryAll(w http.ResponseWriter, r *http.Request) {
	var InstRes []model.Gallery
	Inst := model.NewGallery()

	InstRes = Inst.SelectAllGallery()
	data, err := json.Marshal(InstRes)
	if err != nil {
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
func (web *Tm) GalleryRemove(w http.ResponseWriter, r *http.Request) {
	var req model.Wgallery
	Inst := model.NewGallery()
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		//log.Println("Server Starting")
		return
	}
	InstRes := Inst.DeleteGallery(req.Id)
	data, err := json.Marshal(InstRes)
	if err != nil {
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
func (web *Tm) GalleryModified(w http.ResponseWriter, r *http.Request) {
	var req model.Wgallery
	Inst := model.NewGallery()
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		//log.Println("Server Starting")
		return
	}
	InstRes := Inst.UpdateGallery(req)
	data, err := json.Marshal(InstRes)
	if err != nil {
		log.Println(err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
