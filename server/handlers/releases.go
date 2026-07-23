package handlers

import (
	"context"
	"net/http"
	"os"
	"strconv"
	"submental-api/database"
	"submental-api/models"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func GetReleases(c *gin.Context) {
	rows, err := database.Pool.Query(context.Background(), `
		SELECT id, artist, title, cover_url, release_year
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

		err := rows.Scan(&r.ID, &r.Artist, &r.Title, &r.CoverURL, &r.ReleaseYear)
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

func PostReleases(c *gin.Context) {
	title := c.PostForm("title")
	artist := c.PostForm("artist")
	yearStr := c.PostForm("year")
	year, _ := strconv.Atoi(yearStr)

	file, err := c.FormFile("cover_image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A imagem da capa é obrigatória."})
		return
	}

	srcFile, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar o arquivo."})
		return
	}
	defer srcFile.Close()
	cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao conectar com o serviço de imagens."})
		return
	}

	ctx := context.Background()
	uploadResult, err := cld.Upload.Upload(ctx, srcFile, uploader.UploadParams{
		Folder: "submental/releases",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao enviar imagem para a nuvem."})
		return
	}

	coverURL := uploadResult.SecureURL

	query := `
		INSERT INTO releases (artist, title, cover_url, release_year)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`

	var newID string
	err = database.Pool.QueryRow(ctx, query, artist, title, coverURL, year).Scan(&newID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar no banco de dados."})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Lançamento criado com sucesso!"})
}

func PutReleases(c *gin.Context) {
	id := c.Param("id")

	title := c.PostForm("title")
	artist := c.PostForm("artist")
	yearStr := c.PostForm("year")
	year, _ := strconv.Atoi(yearStr)

	file, err := c.FormFile("cover_image")

	if err == nil {
		srcFile, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar o arquivo."})
			return
		}
		defer srcFile.Close()

		cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao conectar com o serviço de imagens."})
			return
		}

		ctx := context.Background()
		uploadResult, err := cld.Upload.Upload(ctx, srcFile, uploader.UploadParams{
			Folder: "submental/releases",
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao enviar nova imagem para a nuvem."})
			return
		}

		coverURL := uploadResult.SecureURL

		query := `
			UPDATE releases
			SET artist = $1, title = $2, cover_url = $3, release_year = $4
			WHERE id = $5
		`
		commandTag, err := database.Pool.Exec(ctx, query, artist, title, coverURL, year, id)
		if err != nil || commandTag.RowsAffected() == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar com imagem."})
			return
		}

	} else {
		query := `
			UPDATE releases
			SET artist = $1, title = $2, release_year = $3
			WHERE id = $4
		`
		commandTag, err := database.Pool.Exec(context.Background(), query, artist, title, year, id)
		if err != nil || commandTag.RowsAffected() == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar textos."})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Lançamento atualizado com sucesso!"})
}

func DeleteReleases(c *gin.Context) {
	id := c.Param("id")

	query := `DELETE FROM releases WHERE id = $1`
	commandTag, err := database.Pool.Exec(context.Background(), query, id)

	if err != nil || commandTag.RowsAffected() == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar ou lançamento não encontrado."})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Lançamento deletado com sucesso!"})
}
