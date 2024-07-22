import React from "react";
import FilledButton from "../../components/button";
import FormContainer from "../../components/form-container";
import TextField from "../../components/text-field";
import { Label } from "../../styled/label";
import { Title } from "../../styled/title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadFile from "../../components/upload-widget";
import DropdownList from "../../components/dropdown-list";
import { QUESTION_LIST } from "../../lists/questions/personal-question";
import { GENDER_LIST } from "../../lists/gender.tsx/gender-option";
import Recaptcha from "../../components/recaptcha";
import background from "../../assets/daniel-leone-g30P1zcOzXo-unsplash.jpg";
import { H5 } from "../../styled/h5";
import useValidateUser from "../../hooks/useValidateUser";

export default function RegisterPage() {
  // Validate user
  const {data, isLoading, error} = useValidateUser();

  const navigate = useNavigate();
  const [capVal, setCapVal] = React.useState<string | null>("");

  const [fields, setFields] = React.useState({
    email: "",
    password: "",
    confirmpassword: "",
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    image: "",
    question: "",
    answer: "",
  });

  const [checkbox, setCheckbox] = React.useState(true);

  const [errors, setErrors] = React.useState("");

  //Handle Newsletter
  const checkBoxHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckbox(e.target.checked)
  };

  //Handle File
  const handleFileChange = (base64: string) => {
    setFields((prevFields) => ({ ...prevFields, image: base64 }));
    console.log(base64);
  };

  //Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      console.log(fields);
      console.log("NIH VALUE NYA : ", checkbox);
      

      //POST AXIOS
      const response = await axios.post("http://localhost:3000/signup", {
        Email: fields.email,
        Password: fields.password,
        ConfirmPassword: fields.confirmpassword,
        FirstName: fields.first_name,
        LastName: fields.last_name,
        DOB: fields.dob,
        Image: fields.image,
        Gender: fields.gender,
        Question: fields.question,
        Answer: fields.answer,
        Subscribe: checkbox,
      });

      if (response.status == 200) {
        navigate("/login");
      } else {
        console.log(response);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.error || "An unexpected error occurred";
        setErrors(message);
      }
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
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        height: "100vh",
        position: "relative",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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

      <div
        style={{
          zIndex: "2",
        }}
      >
        {/* Form Container */}
        <FormContainer
          height="710px"
          display="column"
          width="35vw"
          alignItems="center"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "75%",
              height: "100%",
              justifyContent: "space-between",
              // alignItems:'left',
              // backgroundColor:'red'
            }}
          >
            <Title>Register/Daftar</Title>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {/* Name */}
              <div
                style={{
                  padding: "0 5px 0 0",
                  width: "50%",
                }}
              >
                <TextField
                  placeholder="Nama depan"
                  name="first_name"
                  onChange={handleChange}
                />
              </div>
              <div
                style={{
                  padding: "0 0 0 5px",
                  width: "50%",
                }}
              >
                <TextField
                  placeholder="Nama Belakang"
                  name="last_name"
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Email */}
            <TextField
              placeholder="Email / no. handphone"
              name="email"
              onChange={handleChange}
            />
            {/* Gender */}
            <DropdownList
              children={GENDER_LIST}
              name="gender"
              onValueChange={handleDropdownChange}
            />
            {/* Personal Question */}
            <DropdownList
              children={QUESTION_LIST}
              name="question"
              onValueChange={handleDropdownChange}
            />
            {/* Answer */}
            <TextField
              placeholder="Answer Here"
              name="answer"
              onChange={handleChange}
            />
            {/* Password */}
            <TextField
              placeholder="Password"
              name="password"
              onChange={handleChange}
              type="password"
            />
            {/* Confirm Password */}
            <TextField
              placeholder="Confirm Password"
              name="confirmpassword"
              onChange={handleChange}
              type="password"
            />
            {/* DOB */}
            <TextField
              placeholder="Date of birth"
              name="dob"
              onChange={handleChange}
              type="date"
            />
            {/* File */}
            <UploadFile onFileChange={handleFileChange} />
            {/* Newsletter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                name="isSubscribe"
                checked={checkbox}
                onChange={checkBoxHandleChange}
              />
              <Label>Masukkan email / no. handphone</Label>
            </div>
            {/* Recaptcha */}
            <Recaptcha
              capVal={capVal}
              setCapVal={(newVal) => setCapVal(newVal)}
            />
            {errors && (
              <H5 align="center" color="red">
                {errors}
              </H5>
            )}
            {/* Button */}
            <FilledButton
              disabled={capVal ? false : true}
              name="Lanjutkan"
              color="black"
              onClick={handleFormSubmit}
            ></FilledButton>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
