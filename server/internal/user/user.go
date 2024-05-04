package user

import (
	"os"
	"time"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Created   time.Time `json:"created_at"`
	Updated   time.Time `json:"updated_at"`
	LastLogin time.Time `json:"last_login"`
}

type UserClaims struct {
	User *User `json:"user"`
	jwt.RegisteredClaims
}

func dbUserToUser(u *database.User) *User {
	return &User{
		ID:        int(u.ID),
		Name:      u.Name,
		Email:     u.Email,
		Created:   u.CreatedAt,
		Updated:   u.UpdatedAt,
		LastLogin: u.LastLogin,
	}
}

func (u *User) GetUserToken() (string, error) {
	claims := UserClaims{
		u,
		jwt.RegisteredClaims{
			Issuer:    "passporter",
			Subject:   u.Email,
			ID:        uuid.New().String(),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(time.Hour * 24))),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		}}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(os.Getenv("JWT_SECRET"))
	if err != nil {
		return "", err
	}
	return ss, nil
}
