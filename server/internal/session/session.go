package session

import (
	"time"

	"github.com/google/uuid"
)

type SessionData struct {
	Exprires int64 `json:"exprires"`
	UserID   int64 `json:"user_id"`
}

type Session struct {
	Key  string
	Data *SessionData
}

func New(userID int) *Session {
	sd := SessionData{
		Exprires: time.Now().Add(time.Hour * 24).Unix(),
		UserID:   int64(userID),
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
