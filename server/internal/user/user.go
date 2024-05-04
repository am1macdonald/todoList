package user

import (
	"os"
	"time"

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

func (u *User) GetAccessToken() (string, error) {
	return u.genToken("passporter_access", time.Now().Add(time.Duration(time.Hour*24)))
}

func (u *User) GetRefreshToken() (string, error) {
	return u.genToken("passporter_refresh", time.Now().Add(time.Duration(time.Hour*24*30)))
}

func (u *User) GetLoginToken() (string, error) {
	return u.genToken("passporter_login", time.Now().Add(time.Duration(time.Minute*5)))
}

func (u *User) genToken(issuer string, expiry time.Time) (string, error) {
	claims := UserClaims{
		u,
		jwt.RegisteredClaims{
			Issuer:    issuer,
			Subject:   u.Email,
			ID:        uuid.New().String(),
			ExpiresAt: jwt.NewNumericDate(expiry),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		}}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

