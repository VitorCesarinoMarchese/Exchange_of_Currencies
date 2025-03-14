import { NavLink, useNavigate } from "react-router";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import { FormEvent, useState } from "react";
import { signupService } from "../services/signupService";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null)
  const [signupLoading, setSignupLoading] = useState(false);
  const navigate = useNavigate();


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if(!name || !email || !password || !confirmPassword){
            setSignupError("All fields need to be filled")
            return
        }
        if(password != confirmPassword){
            setSignupError("The password need to be the same of the confirm password")
            return 
        }
        setSignupLoading(true)
        const {data, error} = await signupService(name, email, password)

        setSignupLoading(false)

        if(data.error){
            setSignupError(error)
            return
        }
        
        if(data.message){
            navigate("/login")
        }
    }


  return (
    <>
      {localStorage.getItem("access_token") ?  navigate("/")  : "" }
      <Navbar logged={false} />
      <div className="flex flex-col items-center mt-8 ">
        <h1 className="text-3xl font-bold mb-7">Signup</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3"
        >
          <Input
            type="name"
            placeholder="Name"
            className="text-center"
            change={(e) => setName(e.target.value)}
            w="w-80 md:w-[500px]"
          />
          <Input
            type="email"
            placeholder="example@email.com"
            className="text-center"
            change={(e) => setEmail(e.target.value)}
            w="w-80 md:w-[500px]"

          />
          <Input
            type="password"
            placeholder="Strong Password"
            className="text-center"
            change={(e) => setPassword(e.target.value)}
            w="w-80 md:w-[500px]"

          />
          <Input
            type="password"
            placeholder="Repeat Password"
            className="text-center"
            change={(e) => setConfirmPassword(e.target.value)}
            w="w-80 md:w-[500px]"

          />
          {signupError && <p className="text-red-500 text-sm">{signupError}</p>}

          <Btn
            label={signupError ? "Signuping in..." : "Signup"}
            color="secondary"
            classname="mt-3 mb-1"
            w="w-80 md:w-[500px]"
            disable={signupLoading}
            func={handleSubmit}
          />
        </form>
        <p>
          Already have an account{" "}
          <NavLink
            to={"/login"}
            className="text-accent underline cursor-pointer"
          >
            click here
          </NavLink>
        </p>
      </div>
    </>
  );
}

export default Register;
