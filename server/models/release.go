package models

import "time"

type Release struct {
	ID            string    `json:"id"`
	Artist        string    `json:"artist"`
	Title         string    `json:"title"`
	CoverURL      string    `json:"coverUrl"`
	ReleaseYear   int       `json:"year"`
	SoundCloudURL string    `json:"soundCloudUrl"`
	PreviewURL    string    `json:"previewUrl"`
	CreatedAt     time.Time `json:"-"`
}
