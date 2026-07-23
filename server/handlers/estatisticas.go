package handlers

import (
	"context"
	"net/http"
	"submental-api/database"

	"github.com/gin-gonic/gin"
)

func GetDashboardStats(c *gin.Context) {
	ctx := context.Background()

	var totalMixtapes int
	err := database.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM mixtapes").Scan(&totalMixtapes)
	if err != nil {
		totalMixtapes = 0
	}

	var nextEventTitle string
	var nextEventDate string
	err = database.Pool.QueryRow(ctx, `
		SELECT name, TO_CHAR(event_date, 'YYYY-MM-DD') 
		FROM events 
		WHERE status = 'upcoming' 
		ORDER BY event_date ASC 
		LIMIT 1
	`).Scan(&nextEventTitle, &nextEventDate)

	if err != nil {
		nextEventTitle = "Nenhum evento futuro"
		nextEventDate = "--"
	}

	c.JSON(http.StatusOK, gin.H{
		"totalMixtapes": totalMixtapes,
		"nextEvent": gin.H{
			"title": nextEventTitle,
			"date":  nextEventDate,
		},
	})
}
