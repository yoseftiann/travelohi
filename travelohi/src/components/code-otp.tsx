import React from "react";
import { InputOTP } from "../styled/input-otp";

interface ICodeOTPProps {
  onOtpChange: (otp: string) => void;
}


export default function CodeOTP({ onOtpChange } : ICodeOTPProps) {
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const inputRefs = React.useRef([
    React.createRef<HTMLInputElement>(), 
    React.createRef<HTMLInputElement>(), 
    React.createRef<HTMLInputElement>(), 
    React.createRef<HTMLInputElement>()
  ]);

  const handleChange = (element : HTMLInputElement, index : number) => {
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (index < 3 && element.value) {
      inputRefs.current[index + 1].current?.focus();
    }

    if (index > 0 && element.value === "") {
      inputRefs.current[index - 1].current?.focus();
    }

    if (newOtp.every(num => num.length === 1)) {
      const completeOTP = newOtp.join('');
      onOtpChange(completeOTP);
    }
  };

  return (
    <div>
      <InputOTP
        maxLength={1}
        onChange={(e) => handleChange(e.target, 0)}
        ref={inputRefs.current[0]}
        value={otp[0]}
        id="c1"
      ></InputOTP>
      <InputOTP
        maxLength={1}
        onChange={(e) => handleChange(e.target, 1)}
        ref={inputRefs.current[1]}
        value={otp[1]}
        id="c2"
      ></InputOTP>
      <InputOTP
        maxLength={1}
        onChange={(e) => handleChange(e.target, 2)}
        ref={inputRefs.current[2]}
        value={otp[2]}
        id="c3"
      ></InputOTP>
      <InputOTP
        maxLength={1}
        onChange={(e) => handleChange(e.target, 3)}
        ref={inputRefs.current[3]}
        value={otp[3]}
        id="c4"
      ></InputOTP>
    </div>
  );
}
