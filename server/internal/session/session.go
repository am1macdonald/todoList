package session

import (
	"time"

	"github.com/google/uuid"
)

type SessionData struct {
	Exprires int64  `json:"exprires"`
	UserID   int64  `json:"user_id"`
	Username string `json:"username"`
}

type Session struct {
	Key  string
	Data *SessionData
}

func New(userID int, username string) *Session {
	sd := SessionData{
		Exprires: time.Now().Add(time.Hour * 24).Unix(),
		UserID:   int64(userID),
		Username: username,
	}
	s := Session{
		Key:  uuid.New().String(),
		Data: &sd,
	}
	return &s
}

func FromToken(token string) (*Session, error) {
	return nil, nil
}

func (s *Session) Destroy() error {
	return nil
}

func (s *Session) IsExpired() bool {
	return time.Now().After(time.Unix(s.Data.Exprires, 0))
}
