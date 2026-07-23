package handlers

import (
	"context"
	"submental-api/database"
	"submental-api/models"

	"github.com/gin-gonic/gin"
)

func GetEvents(c *gin.Context) {
	query := `
		SELECT id, name, TO_CHAR(event_date, 'DD/MM') as date, location, status, headliners, guests
		FROM events
		ORDER BY event_date ASC
	`
	rows, err := database.Pool.Query(context.Background(), query)
	if err != nil {
		c.JSON(500, gin.H{"error": "Erro ao buscar eventos"})
		return
	}
	defer rows.Close()

	var events []models.Event

	for rows.Next() {
		var e models.Event

		err := rows.Scan(&e.ID, &e.Name, &e.Date, &e.Location, &e.Status, &e.Headliners, &e.Guests)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erro ao escanear eventos"})
			return
		}
		events = append(events, e)
	}

	if events == nil {
		events = []models.Event{}
	}
	c.JSON(200, events)
}
