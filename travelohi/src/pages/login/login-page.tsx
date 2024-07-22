import React from "react";
import FilledButton from "../../components/button";
import TextDivider from "../../components/divider-text";
import FormContainer from "../../components/form-container";
import TextField from "../../components/text-field";
import { Label } from "../../styled/label";
import { Title } from "../../styled/title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Recaptcha from "../../components/recaptcha";
import { Span } from "../../styled/span-u";
import background from "../../assets/dominik-schroder-FIKD9t5_5zQ-unsplash.jpg";
import useValidateUser from "../../hooks/useValidateUser";
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com)$/;

export default function LoginPage() {
  // Validate user
  const {data, isLoading, error} = useValidateUser();

  const navigate = useNavigate();

  const [capVal, setCapVal] = React.useState<string | null>("");
  const [fields, setFields] = React.useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });

  //Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  //Validation
  const validateEmail = (email: string) => {
    if (!email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please fill the email",
      }));
      return false;
    } else if (!emailPattern.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      return false;
    }

    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Please fill the password",
      }));
      return false;
    } else if (password.length < 8) {
      //gnati sama matched to AXIOS
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Credentials not found",
      }));
      return false;
    }

    return true;
  };

  //Send Request
  const handleFormSubmit = async () => {
    console.log(fields.email);
    console.log(fields.password);

    if (
      validateEmail(fields.email.toString().trim().toLowerCase()) &&
      validatePassword(fields.password.trim())
    ) {
      //POST AXIOS
      try {
        const response = await axios.post(
          "http://localhost:3000/login",
          {
            email: fields.email,
            password: fields.password,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status == 200) {
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // alert("Please enter both email and password");
    }
  };

  React.useEffect(() => {
    if(data){
      navigate('/home')
    }
  }, [data, navigate])

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />
      {/* Form Container */}
      <div
        style={{
          zIndex: "2",
        }}
      >
        <FormContainer display="column" height="400px">
          <Title>Login/Masuk</Title>
          <Label>Masukkan email / no. handphone</Label>
          <TextField
            placeholder="Email / no. handphone"
            name="email"
            onChange={handleChange}
          />
          <div>
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>
          <TextField
            placeholder="Password"
            name="password"
            onChange={handleChange}
            type="password"
          />
          <div>
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
          </div>
          {/* Recaptcha */}
          <Recaptcha
            capVal={capVal}
            setCapVal={(newVal) => setCapVal(newVal)}
          />

          {/* Submit Button */}
          <FilledButton
            disabled={capVal ? false : true}
            name="Login"
            color="black"
            onClick={handleFormSubmit}
          ></FilledButton>
          <TextDivider name="atau" />
          <FilledButton
            name="Send me an OTP"
            color="black"
            onClick={() => navigate("/otplogin")}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              width: "100%",
              gap: "0.5rem",
            }}
          >
            <Span onClick={() => navigate("/register")}>Register New Account</Span>
            <Span onClick={() => navigate("/forgotpassword")}>Forgot password?</Span>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
