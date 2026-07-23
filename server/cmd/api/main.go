package main

import (
	"fmt"
	"os"

	"submental-api/database"
	"submental-api/handlers"
	"submental-api/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	database.Connect()

	defer database.Pool.Close()

	r := gin.Default()
	r.Static("/uploads", "./uploads")

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"status":  "Api submental rodando",
		})
	})

	api := r.Group("/api")
	{
		api.GET("/releases", handlers.GetReleases)
		api.GET("/events", handlers.GetEvents)
		api.GET("/mixtapes", handlers.GetMixtapes)
		api.POST("/login", handlers.Login)
	}

	admin := r.Group("/api/admin")
	admin.Use(middlewares.RequireAuth())
	{
		admin.GET("/eventos", handlers.GetEvents)
		admin.POST("/eventos", handlers.PostEvents)
		admin.DELETE("/eventos/:id", handlers.DeleteEvent)
		admin.PUT("/eventos/:id", handlers.UpdateEvent)
		admin.POST("/mixtapes", handlers.PostMixtapes)
		admin.PUT("/mixtapes/:id", handlers.PutMixtapes)
		admin.DELETE("/mixtapes/:id", handlers.DeleteMixtapes)
		admin.POST("/releases", handlers.PostReleases)
		admin.PUT("/releases/:id", handlers.PutReleases)
		admin.DELETE("/releases/:id", handlers.DeleteReleases)
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	fmt.Printf("Servidor rodando na porta %s...\n", port)
	r.Run(":" + port)

}
