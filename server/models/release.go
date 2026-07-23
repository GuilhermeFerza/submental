package models

import "time"

type Release struct {
	ID               string    `json:"id"`
	Artist           string    `json:"artist"`
	Title            string    `json:"title"`
	CoverPlaceholder string    `json:"coverPlaceholder"`
	ReleaseYear      int       `json:"year"`
	CreatedAt        time.Time `json:"-"`
}
