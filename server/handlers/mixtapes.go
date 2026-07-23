package handlers

import (
	"context"
	"submental-api/database"
	"submental-api/models"

	"github.com/gin-gonic/gin"
)

func GetMixtapes(c *gin.Context) {
	query := `
		SELECT id, title, duration
		FROM mixtapes
		ORDER BY created_at DESC
	`

	rows, err := database.Pool.Query(context.Background(), query)
	if err != nil {
		c.JSON(500, gin.H{"error": "Erro ao buscar mixtapes"})
		return
	}
	defer rows.Close()

	var mixtapes []models.Mixtape

	for rows.Next() {
		var m models.Mixtape
		err := rows.Scan(&m.ID, &m.Title, &m.Duration)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erro ao escanear mixtapes"})
			return
		}
		mixtapes = append(mixtapes, m)
	}
	if mixtapes == nil {
		mixtapes = []models.Mixtape{}
	}
	c.JSON(200, mixtapes)
}
