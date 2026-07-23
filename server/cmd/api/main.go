package main

import (
	"fmt"
	"os"

	"submental-api/database"

	"github.com/gin-gonic/gin"
)

func main() {

	database.Connect()

	defer database.Pool.Close()

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"status":  "Api submental rodando",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Servidor rodando na porta %s...\n", port)
	r.Run(":" + port)

}
