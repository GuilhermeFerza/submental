package handlers

import (
	"context"
	"net/http"
	"os"
	"submental-api/database"
	"submental-api/models"
	"submental-api/utils"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email e senhas sao obrigatorios"})
		return
	}

	var user models.User

	query := `SELECT id, name, password FROM users WHERE email = $1`

	err := database.Pool.QueryRow(context.Background(), query, input.Email).Scan(&user.ID, &user.Name, &user.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "credenciais invalidas"})
		return
	}

	senhaValida := utils.CheckPasswordHash(input.Password, user.Password)

	if !senhaValida {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "credenciais invalidas"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	secret := os.Getenv("JWT_SECRET")

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar autenticacao"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":   user.ID,
			"name": user.Name,
		},
	})

}
