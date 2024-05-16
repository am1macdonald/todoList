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

func New(userID int) *Session {
	sd := SessionData{
		Exprires: time.Now().Add(time.Hour * 24).Unix(),
		UserID:   int64(userID),
	}
	s := Session{
		Key:  "todo:session:" + uuid.New().String(),
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
