import ReCAPTCHA from "react-google-recaptcha";

interface IRecaptcha {
    capVal: string | null;
    setCapVal: (val: string | null) => void;
}

export default function Recaptcha({capVal, setCapVal} : IRecaptcha) {
  return <ReCAPTCHA 
  sitekey="6LcLv1opAAAAANO4aTaORarOnSkee7BlEcHxK_pP" 
  onChange={setCapVal}
  />;
}
