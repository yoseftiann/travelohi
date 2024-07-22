import FilledButton from "../../components/button";
import TextField from "../../components/text-field";
import { Label } from "../../styled/label";;
import axios from "axios";
import React from "react";
import CodeOTP from "../../components/code-otp";
import { H1 } from "../../styled/h1";
import { Container } from "../../styled/container";
import { H5 } from "../../styled/h5";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFingerprint, faKey } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/logo";

export default function OTPLoginPage() {
  //Use state
  const [error, setError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [currentContent, setCurrentContent] = React.useState(1);

  //Navigate
  const navigate = useNavigate();

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleContentChange = () => {
    if (currentContent % 2 == 0) {
      setCurrentContent(1);
    } else {
      setCurrentContent(currentContent + 1);
    }
  };

  const handleButtonClick = async () => {
    try {
      const response = await axios.post("http://localhost:3000/generate-otp", {
        email: email,
      });

      if (response.status == 200) {
        //SET STATE
        handleContentChange();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Verify
  const handleVerifyButton = async () => {
    try{
      const response = await axios.post("http://localhost:3000/otp-login", {
          email: email,
          code: code
      })

      if (response.status == 200){
        navigate("/home")
      }else{
        console.log(error);
      }
    }catch(error){
      if (axios.isAxiosError(error)) {
        const message = error.response?.data.error || "An unexpected error occurred";
        setError(message);
      }
    }
  }

  //OTP Handler
  const handleOTPChange = (newOtp : any) => {
    setCode(newOtp);
  }

  const content = [
    <>
      <FontAwesomeIcon icon={faFingerprint} size="3x" color="black" />
      <Container
        align="center"
        gap="0.75rem"
        color="#83858b"
        padding="1.25rem 0"
      >
        <H1>Forgot Password?</H1>
        <H5 align="left">No worries, we'll send you otp verification code.</H5>
      </Container>
      <Container align="left" color="black" gap="0.5rem" padding="0">
        <Label>Email</Label>
        <TextField
          placeholder="Enter your email"
          name="email"
          onChange={handleEmailChange}
        />
      </Container>
      <Container align="center" color="white" gap="0.5rem" padding="2rem 0">
        <FilledButton
          name="Send"
          color="#155ef0"
          onClick={handleButtonClick}
        ></FilledButton>
        <FilledButton
          disabled={false}
          addShadow={false}
          color="transparent"
          textColor="#83858b"
          name="Back to log in"
          onClick={() => navigate("/login")}
          icon={faArrowLeft}
        ></FilledButton>
      </Container>
    </>,
    <>
      <FontAwesomeIcon icon={faKey} size="3x" color="black" />
      <Container
        align="center"
        gap="0.75rem"
        color="#83858b"
        padding="1.25rem 0"
      >
        <H1>Password reset</H1>
        <H5 align="left">We sent a code to {email}</H5>
      </Container>
      {/* OTP */}
      <Container align="center" color="black" gap="0" padding="0">
        <CodeOTP onOtpChange={handleOTPChange}></CodeOTP>
      </Container>
      <h5 style={{
        textAlign: 'center',
        color:'red'
      }}>{error}</h5>
      {/*  */}
      <Container align="center" color="white" gap="0.5rem" padding="2rem 0">
        <FilledButton
          name="Verify"
          color="#155ef0"
          onClick={handleVerifyButton}
        ></FilledButton>
        <FilledButton
          disabled={true}
          addShadow={false}
          color="transparent"
          textColor="#83858b"
          name="Back to log in"
          onClick={handleButtonClick}
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
      <Logo/>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          height: "320px",
          width: "320px",
          // backgroundColor: "red",
        }}
      >
        {/* <StepIndicator currentStep={currentContent} totalSteps={2} /> */}
        {/* Rendering */}
        {content[currentContent - 1]}
      </div>
    </div>
  );
}
