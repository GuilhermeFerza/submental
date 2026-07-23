package handlers

import (
	"context"
	"net/http"
	"submental-api/database"
	"submental-api/models"

	"github.com/gin-gonic/gin"
)

func GetMixtapes(c *gin.Context) {
	query := `
		SELECT id, title, duration, youtube_id
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
		err := rows.Scan(&m.ID, &m.Title, &m.Duration, &m.YoutubeID)
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

func PostMixtapes(c *gin.Context) {
	var mix models.Mixtape
	if err := c.ShouldBindJSON(&mix); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos enviados."})
		return
	}

	query := `
		INSERT INTO mixtapes (title, duration, youtube_id)
		VALUES ($1, $2, $3)
		RETURNING id
	`

	var newID string

	err := database.Pool.QueryRow(context.Background(), query, mix.Title, mix.Duration, mix.YoutubeID).Scan(&newID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar no banco de dados."})
		return
	}
	mix.ID = newID
	c.JSON(http.StatusCreated, mix)
}

func PutMixtapes(c *gin.Context) {
	id := c.Param("id")
	var mix models.Mixtape

	if err := c.ShouldBindJSON(&mix); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos."})
		return
	}

	query := `
		UPDATE mixtapes
		SET title = $1, duration = $2, youtube_id = $3
		WHERE id = $4
	`

	commandTag, err := database.Pool.Exec(context.Background(), query, mix.Title, mix.Duration, mix.YoutubeID, id)

	if err != nil || commandTag.RowsAffected() == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar ou mixtape não encontrada."})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Mixtape atualizada com sucesso!"})
}

func DeleteMixtapes(c *gin.Context) {
	id := c.Param("id")

	query := `DELETE from mixtapes WHERE id = $1`
	commandTag, err := database.Pool.Exec(context.Background(), query, id)

	if err != nil || commandTag.RowsAffected() == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar ou mixtape não encontrada."})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Mixtape deletada com sucesso!"})
}
