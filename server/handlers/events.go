package handlers

import (
	"context"
	"net/http"
	"submental-api/database"
	"submental-api/models"

	"github.com/gin-gonic/gin"
)

func GetEvents(c *gin.Context) {
	query := `
		SELECT id, name, TO_CHAR(event_date, 'YYYY-MM-DD') as date, location, status, headliners, guests
		FROM events
		ORDER BY event_date DESC
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

func PostEvents(c *gin.Context) {
	var novoEvento models.Event
	if err := c.ShouldBindJSON(&novoEvento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados invalidos"})
		return
	}

	if novoEvento.Name == "" || novoEvento.Date == "" || novoEvento.Location == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome, Data e Local são obrigatórios."})
		return
	}

	if novoEvento.Headliners == nil {
		novoEvento.Headliners = []string{}
	}
	if novoEvento.Guests == nil {
		novoEvento.Guests = []string{}
	}

	if novoEvento.Status == "" {
		novoEvento.Status = "upcoming"
	} else if novoEvento.Status != "upcoming" && novoEvento.Status != "past" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "O status deve ser 'upcoming' ou 'past'."})
		return
	}

	query := `
		INSERT INTO events (name, event_date, location, status, headliners, guests)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`

	var newID string

	err := database.Pool.QueryRow(context.Background(), query,
		novoEvento.Name,
		novoEvento.Date,
		novoEvento.Location,
		novoEvento.Status,
		novoEvento.Headliners,
		novoEvento.Guests,
	).Scan(&newID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno ao salvar no banco de dados."})
		return
	}

	novoEvento.ID = newID
	c.JSON(http.StatusCreated, novoEvento)

}

func DeleteEvent(c *gin.Context) {
	id := c.Param("id")

	query := `DELETE FROM events WHERE id = $1`

	commandTag, err := database.Pool.Exec(context.Background(), query, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno no banco de dados"})
		return
	}

	if commandTag.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Evento nao encontrado"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Evento excluido com sucesso"})
}

func UpdateEvent(c *gin.Context) {
	id := c.Param("id")
	var eventoAtualizado models.Event

	if err := c.ShouldBindJSON(&eventoAtualizado); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados invalidos"})
		return
	}

	if eventoAtualizado.Name == "" || eventoAtualizado.Date == "" || eventoAtualizado.Location == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome, Data e Local são obrigatórios."})
		return
	}
	if eventoAtualizado.Status == "" {
		eventoAtualizado.Status = "upcoming"
	}

	query := `
		UPDATE events
		SET name = $1, event_date = $2, location = $3, status = $4, headliners = $5, guests = $6
		WHERE id = $7
	`

	commandTag, err := database.Pool.Exec(context.Background(), query,
		eventoAtualizado.Name,
		eventoAtualizado.Date,
		eventoAtualizado.Location,
		eventoAtualizado.Status,
		eventoAtualizado.Headliners,
		eventoAtualizado.Guests,
		id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno ao atualizar evento."})
		return
	}
	if commandTag.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Evento não encontrado."})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Evento atualizado com sucesso."})
}
