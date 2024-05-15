package session

import "sync"
import (
	"time"
)

type SessionData struct {
	Exprires int64
	UserID   int64
}

type Session struct {
	mu   sync.Mutex
	Key  string
	Data map[string]any
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
