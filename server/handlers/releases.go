package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"submental-api/database"
	"submental-api/models"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

type SoundCloundOEmbed struct {
	Title        string `json:"title"`
	AuthorName   string `json:"author_name"`
	ThumbnailURL string `json:"thumbnail_url"`
}

func GetReleases(c *gin.Context) {
	rows, err := database.Pool.Query(context.Background(), `
		SELECT id, artist, title, cover_url, release_year, soundcloud_url, preview_url
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
		var scURL, prevURL *string

		err := rows.Scan(&r.ID, &r.Artist, &r.Title, &r.CoverURL, &r.ReleaseYear, &scURL, &prevURL)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao ler dados"})
			return
		}
		if scURL != nil {
			r.SoundCloudURL = *scURL
		}
		if prevURL != nil {
			r.PreviewURL = *prevURL
		}
		releases = append(releases, r)
	}

	if releases == nil {
		releases = []models.Release{}
	}
	c.JSON(http.StatusOK, releases)
}

func GetSoundCloudMeta(c *gin.Context) {
	targetURL := c.Query("url")
	if targetURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL obrigatória"})
		return
	}

	oEmbedAPI := "https://soundcloud.com/oembed?format=json&url=" + url.QueryEscape(targetURL)
	resp, err := http.Get(oEmbedAPI)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Não foi possível obter dados do SoundCloud"})
		return
	}
	defer resp.Body.Close()

	var data SoundCloundOEmbed
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao decodificar dados"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"title":     data.Title,
		"artist":    data.AuthorName,
		"cover_url": data.ThumbnailURL,
	})
}

func PostReleases(c *gin.Context) {
	title := c.PostForm("title")
	artist := c.PostForm("artist")
	yearStr := c.PostForm("year")
	year, _ := strconv.Atoi(yearStr)
	soundCloudURL := c.PostForm("soundcloud_url")

	var coverURL string

	if soundCloudURL != "" {
		oEmbedAPI := "https://soundcloud.com/oembed?format=json&url=" + url.QueryEscape(soundCloudURL)
		if resp, err := http.Get(oEmbedAPI); err == nil && resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			var data SoundCloundOEmbed
			if json.NewDecoder(resp.Body).Decode(&data) == nil && data.ThumbnailURL != "" {
				coverURL = data.ThumbnailURL
			}
		}
	}

	if coverURL == "" {
		file, err := c.FormFile("cover_image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "A imagem da capa é obrigatória ou informe um link válido do SoundCloud."})
			return
		}

		srcFile, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar o arquivo de capa."})
			return
		}
		defer srcFile.Close()

		cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao conectar com o serviço de nuvem."})
			return
		}

		ctx := context.Background()
		uploadResult, err := cld.Upload.Upload(ctx, srcFile, uploader.UploadParams{Folder: "submental/releases"})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao enviar imagem para a nuvem."})
			return
		}
		coverURL = uploadResult.SecureURL
	}

	var previewURL string
	audioFile, err := c.FormFile("audio_clip")
	if err == nil && audioFile != nil {
		srcAudio, err := audioFile.Open()
		if err == nil {
			defer srcAudio.Close()
			cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
			if err == nil {
				ctx := context.Background()
				resAudio, err := cld.Upload.Upload(ctx, srcAudio, uploader.UploadParams{
					Folder:       "submental/previews",
					ResourceType: "auto",
				})
				if err == nil {
					previewURL = resAudio.SecureURL
				}
			}
		}
	}

	query := `
		INSERT INTO releases (artist, title, cover_url, release_year, soundcloud_url, preview_url)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`

	var newID string
	ctx := context.Background()
	err = database.Pool.QueryRow(ctx, query, artist, title, coverURL, year, soundCloudURL, previewURL).Scan(&newID)
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
	soundCloudURL := c.PostForm("soundcloud_url")

	ctx := context.Background()
	query := `
		UPDATE releases
		SET artist = $1, title = $2, release_year = $3, soundcloud_url = $4
		WHERE id = $5
	`
	_, err := database.Pool.Exec(ctx, query, artist, title, year, soundCloudURL, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar lançamento."})
		return
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
