package mailer

import (
	"log"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

type Mailer struct {
	email    string
	username string
	password string
	host     string
	port     int
}

func New() *Mailer {
	mailer := Mailer{}
	mailer.email = os.Getenv("EMAIL_ADDRESS")
	mailer.username = os.Getenv("EMAIL_USERNAME")
	mailer.password = os.Getenv("EMAIL_PASSWORD")
	mailer.host = os.Getenv("EMAIL_HOST")
	port, err := strconv.Atoi(os.Getenv("EMAIL_PORT"))
	if err != nil {
		log.Fatal("Can't parse enviroment variable 'EMAIL_PORT'")
	}
	mailer.port = port
	return &mailer
}

func (this *Mailer) SendMessage(subject string, message string, to string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", this.email)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", message)

	d := gomail.NewDialer(this.host, this.port, this.username, this.password)

	if err := d.DialAndSend(m); err != nil {
		log.Println(err)
		return err
	}
	return nil
}
