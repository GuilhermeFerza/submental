package models

type Event struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	Date       string   `json:"date"`
	Location   string   `json:"location"`
	Status     string   `json:"status"`
	Headliners []string `json:"headliners"`
	Guests     []string `json:"guests"`
}
