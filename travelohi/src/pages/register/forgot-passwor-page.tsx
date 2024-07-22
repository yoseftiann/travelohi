import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../components/logo";
import { faArrowLeft, faLock, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../../styled/container";
import { H1 } from "../../styled/h1";
import { H5 } from "../../styled/h5";
import { Label } from "../../styled/label";
import TextField from "../../components/text-field";
import FilledButton from "../../components/button";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/login");
  };

  // Handler
  const handleButton = async () => {
    switch (currentContent) {
      case 1:
        try {
          const response = await axios.post(
            "http://localhost:3000/validate-email",
            {
              email: email,
            }
          );

          if (response.status == 200) {
            setAnswer(response.data.user.Answer); // Set answer
            setQuestion(response.data.user.Question); // Set question

            setCurrentContent(2); // Set next content
          }
        } catch (error) {
          console.log(error);
        }
        break;

      case 2:
        try {
          const response = await axios.post(
            "http://localhost:3000/validate-answer",
            {
              email: email,
              answer: answer,
              question: question,
            }
          );

          if (response.status == 200) {
            setCurrentContent(3); //Set next content
          }
        } catch (error) {
          console.log(error);
        }
        break;

      case 3:
        try{
            const response = await axios.post("http://localhost:3000/set-new-password",{
                email: email,
                newpassword : newPassword,
                confirmpassword : confirmPassword
            })

            if (response.status == 200){
                navigate("/home")
            }
        }catch(error){
            console.log(error);
        }
        break;
    }
  };

  //Const
  const [currentContent, setCurrentContent] = React.useState(1);
  const [email, setEmail] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const contennt = [
    // Content 1 --> Enter Email
    <>
      <FontAwesomeIcon icon={faLock} size="3x" color="black" />
      <Container
        align="center"
        gap="0.75rem"
        color="#83858b"
        padding="1.25rem 0"
      >
        <H1>Forgot Password?</H1>
        <H5 align="center">
          Please enter your email address before resetting your password.
        </H5>
      </Container>
      <Container align="left" color="black" gap="0.5rem" padding="0">
        <Label>Email</Label>
        <TextField
          placeholder="Enter your email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Container>
      <Container align="center" color="white" gap="0.5rem" padding="2rem 0">
        <FilledButton
          name="Reset Password"
          color="#155ef0"
          onClick={handleButton}
        ></FilledButton>
        <FilledButton
          disabled={false}
          addShadow={false}
          color="transparent"
          textColor="#83858b"
          name="Back to log in"
          onClick={navigateHome}
          icon={faArrowLeft}
        ></FilledButton>
      </Container>
    </>,
    // Content 2 --> Answer the given question

    <>
      <FontAwesomeIcon icon={faLock} size="3x" color="black" />
      <Container
        align="center"
        gap="0.75rem"
        color="#83858b"
        padding="1.25rem 0"
      >
        <H1>Forgot Password?</H1>
        <H5 align="center">
          To reset your password, we will need you to answer the following
          question correctly.
        </H5>
      </Container>
      <Container align="left" color="black" gap="0.5rem" padding="0">
        <Label>{question}</Label>
        <TextField
          placeholder="Answer here"
          name="answer"
          onChange={(e) => setAnswer(e.target.value)}
        />
      </Container>
      <Container align="center" color="white" gap="0.5rem" padding="2rem 0">
        <FilledButton
          name="Confirm"
          color="#155ef0"
          onClick={handleButton}
        ></FilledButton>
        <FilledButton
          disabled={false}
          addShadow={false}
          color="transparent"
          textColor="#83858b"
          name="Back to log in"
          onClick={navigateHome}
          icon={faArrowLeft}
        ></FilledButton>
      </Container>
    </>,
    // Content 3 --> Set new Password with confirmation
    <>
      <FontAwesomeIcon icon={faShieldHalved} size="3x" color="black" />
      <Container
        align="center"
        gap="0.75rem"
        color="#83858b"
        padding="1.25rem 0"
      >
        <H1>Create New Password?</H1>
        <H5 align="center">
          Your new password, must be diffrent from previously used password.
        </H5>
      </Container>
      <Container align="left" color="black" gap="0.5rem" padding="0">
        <Label>New Password</Label>
        <TextField
        type="password"
          placeholder="Password"
          name="new-password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
        type="password"
          placeholder="Confirm your password"
          name="confirm-new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Container>
      <Container align="center" color="white" gap="0.5rem" padding="2rem 0">
        <FilledButton
          name="Confirm"
          color="#155ef0"
          onClick={handleButton}
        ></FilledButton>
        <FilledButton
          disabled={false}
          addShadow={false}
          color="transparent"
          textColor="#83858b"
          name="Back to log in"
          onClick={navigateHome}
          icon={faArrowLeft}
        ></FilledButton>
      </Container>
    </>,
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* Header */}
      <Logo />
      <div
        style={{
          width: "20vw",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {contennt[currentContent - 1]}
      </div>
    </div>
  );
}
