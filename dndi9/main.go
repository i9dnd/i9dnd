package main

import (
	"encoding/json"
	"net/http"
	"sync"
)

type RollHistory struct {
	D20      int    `json:"d20"`
	Mutation string `json:"mutation"`
}

var history []RollHistory
var mu sync.Mutex

func main() {
	http.Handle("/", http.FileServer(http.Dir("./")))

	http.HandleFunc("/history", getHistory)
	http.HandleFunc("/save", saveHistory)

	http.ListenAndServe(":8080", nil)
}

func getHistory(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(history)
}

func saveHistory(w http.ResponseWriter, r *http.Request) {
	var newRoll RollHistory
	if err := json.NewDecoder(r.Body).Decode(&newRoll); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mu.Lock()
	if len(history) >= 15 {
		history = history[1:]
	}
	history = append(history, newRoll)
	mu.Unlock()

	w.WriteHeader(http.StatusNoContent)
}
