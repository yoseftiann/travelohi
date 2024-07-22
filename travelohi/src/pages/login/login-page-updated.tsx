import TextField from "../../components/text-field";
import { Label } from "../../styled/label";
import { useForm } from 'react-hook-form';

export default function LoginUpdatedPage() {
  const {register, handleSubmit, watch,formState: { errors },} = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    criteriaMode: "all",
  });

  const handleFormSubmit = async (data : any) => {
    // POST request with axios
    console.log(data);
    
  };
  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Label>Masukkan email / no. handphone</Label>
        <input
          {...register("email", {
            required: "Please fill the email",
          })}
          placeholder="Email / no. handphone"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        <input type="submit" />
      </form>
    </div>
  );
}
