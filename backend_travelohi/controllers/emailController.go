package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"bytes"
	"fmt"
	"html/template"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gopkg.in/gomail.v2"
)

func SendSignupSuccess(templatePath string, to string, name string) {
	//Get HTML
	var body bytes.Buffer
	t, error := template.ParseFiles(templatePath)

	t.Execute(&body, struct{ Name string }{Name: name})
	if error != nil {
		fmt.Println(error)
		return
	}

	//Send with Gomail
	m := gomail.NewMessage()
	m.SetHeader("From", "yonuhren567@gmail.com")
	m.SetHeader("To", to)                     //V
	m.SetHeader("Subject", "Welcome Aboard!") //V
	m.SetBody("text/html", body.String())

	d := gomail.NewDialer("smtp.gmail.com", 587, "yonuhren567@gmail.com", os.Getenv("APPPASSWORD"))

	if error := d.DialAndSend(m); error != nil {
		panic(error)
	}
}

func SendOTPMail(templatePath string, to string, code string) {
	//Get HTML
	var body bytes.Buffer
	t, err := template.ParseFiles(templatePath)

	err = t.Execute(&body, struct {
		Code string
	}{Code: code})

	if err != nil {
		fmt.Println("Error executing template:", err)
		return
	}

	//Send with Gomail
	m := gomail.NewMessage()
	m.SetHeader("From", "yonuhren567@gmail.com")
	m.SetHeader("To", to)                            //V
	m.SetHeader("Subject", "OTP Verification Code!") //V
	m.SetBody("text/html", body.String())

	d := gomail.NewDialer("smtp.gmail.com", 587, "yonuhren567@gmail.com", os.Getenv("APPPASSWORD"))

	if error := d.DialAndSend(m); error != nil {
		fmt.Println("Error in sending email : ", error)
		return
	}

	fmt.Println(code)
}

func SendNewsletterMail(templatePath string, subject string, to string, content string) {
	//Get HTML
	var body bytes.Buffer
	t, err := template.ParseFiles(templatePath)
	if err != nil {
		fmt.Println("Error parsing template:", err)
		return
	}

	//Execute {{ .Content }}
	data := struct {
		Content string
	}{
		Content: content,
	}

	err = t.Execute(&body, data)

	//Send with Gomail
	m := gomail.NewMessage()
	m.SetHeader("From", "yonuhren567@gmail.com") // Email verified by admin to send
	m.SetHeader("To", to)                        // V
	m.SetHeader("Subject", subject)              // V
	m.SetBody("text/html", body.String())        // V

	d := gomail.NewDialer("smtp.gmail.com", 587, "yonuhren567@gmail.com", os.Getenv("APPPASSWORD"))

	if error := d.DialAndSend(m); error != nil {
		fmt.Println("Error in sending email : ", error)
		return
	}
}

func BroadcastNewsletter(c *gin.Context) {
	//Template path
	var templatePath = "./templates/newsletter-broadcast.html"

	//Fetch user that are not banned and subscribe
	var users []models.User
	if err := initializers.DB.Where("subscribe = ? AND is_banned = ?", true, false).Find(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching users",
		})
		return
	}

	//Get formData
	subject := c.PostForm("subject")
	content := c.PostForm("content")

	//Send
	for _, user := range users {
		go SendNewsletterMail(templatePath, subject, user.Email, content)
	}
}
