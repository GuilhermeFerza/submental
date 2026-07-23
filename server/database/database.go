package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var Pool *pgxpool.Pool

func Connect() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Aviso: Arquivo .env não encontrado. Usando variáveis de sistema.")
	}

	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		log.Fatal("DB_URL nao configurada no .env")
	}

	Pool, err = pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("Erro ao pingar o banco de dados: %v\n", err)
	}

	if err := Pool.Ping(context.Background()); err != nil {
		log.Fatalf("Erro ao pingar o banco de dados: %v\n", err)
	}
	fmt.Println("Conexão com o Supabase estabelecida com sucesso!")

}
