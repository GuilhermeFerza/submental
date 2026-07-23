package handlers

import (
	"context"
	"net/http"
	"submental-api/database"
	"submental-api/models"

	"github.com/gin-gonic/gin"
)

func GetReleases(c *gin.Context) {
	rows, err := database.Pool.Query(context.Background(), `
		SELECT id, artist, title, cover_placeholder, release_year
		FROM releases
		ORDER BY created_at DESC;
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao buscar releases"})
		return
	}
	defer rows.Close()

	var releases []models.Release

	for rows.Next() {
		var r models.Release

		err := rows.Scan(&r.ID, &r.Artist, &r.Title, &r.CoverPlaceholder, &r.ReleaseYear)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao ler dados"})
			return
		}
		releases = append(releases, r)
	}

	if releases == nil {
		releases = []models.Release{}
	}
	c.JSON(http.StatusOK, releases)
}
