package session

import (
	"time"
	"github.com/google/uuid"
)

type SessionData struct {
	Exprires int64
	UserID   int64
}

type Session struct {
	Key  string
	Data *SessionData
}

func New() (*Session, error) {
	return nil, nil
}

func FromToken(token string) (*Session, error) {
	return nil, nil
}

func (s *Session) Destroy() error {
	return nil
}
