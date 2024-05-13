package task

type Task struct {
	ID          int64  `json:"id"`
	UserID      int64  `json:"user_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Priority    int64  `json:"priority"`
	Checklist   string `json:"checklist"`
	Notes       string `json:"notes"`
	Deadline    int64  `json:"deadline"`
	Complete    bool   `json:"complete"`
}
