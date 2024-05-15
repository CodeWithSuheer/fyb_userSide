import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createuserAsync } from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Spinner } from "keep-react";
import { Helmet } from "react-helmet";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { signupLoading } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(createuserAsync(formData)).then((res) => {
      if (res.payload.success) {
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        navigate("/login");
      }
    });
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sign up - For Your Beauty</title>
      </Helmet>

      <section className="py-10 sm:py-10 px-3 sm:px-4 md:px-14 bg-[#FDEDF5]">
        <div className="max-w-5xl xl:max-w-4xl mx-auto">
          <div className="flex justify-center items-center flex-col-reverse sm:flex-row gap-10 md:gap-2 min-h-[80vh]">
            {/* IMAGE SIDE */}
            <div className="min-w-[50%] mx-auto hidden md:flex">
              <img
                className="w-[90%]"
                src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Rectangle_3951_1.png?v=1715021877"
                alt="login Img"
              />
            </div>

            {/* FORM SIDE */}
            <div className="min-w-[60%] md:min-w-[50%]">
              <h1 className="playfair max-w-xs sm:max-w-full mb-5 text-4xl sm:text-4xl font-bold">
                Signup Your Account
              </h1>

              <p className="max-w-full mb-5 text-md">
                Lorem ipsum dolor sit amet consectetur.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-4">
                {/* NAME */}
                <div>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md block w-full px-3 py-3"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md block w-full px-3 py-3"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter Your Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md block w-full px-3 py-3"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter Your Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                {/* TOGGLE PASSWORD VISIBILITY */}
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        aria-describedby="remember"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                        id="remember"
                        type="checkbox"
                        onChange={togglePasswordVisibility}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        className="text-gray-500 dark:text-gray-300 select-none cursor-pointer"
                        htmlFor="remember"
                      >
                        show password
                      </label>
                    </div>
                  </div>
                </div>

                {signupLoading ? (
                  <button className="w-full h-11 items-center mx-auto bg-[#EC72AF] text-white flex justify-center tracking-wide">
                    <Spinner color="pink" size="md" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full h-11 items-center mx-auto bg-[#EC72AF] text-white flex justify-center tracking-wide"
                  >
                    SIGNUP NOW
                  </button>
                )}

                {/* TERM & CONDITION LINKS*/}
                <p className="max-w-sm text-sm font-normal text-gray-800">
                  By creating an account, you agree to It Experts{" "}
                  <Link
                    to="/terms"
                    className="underline underline-offset-2 font-medium cursor-pointer"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="underline underline-offset-2 font-medium cursor-pointer"
                  >
                    Privacy Policy
                  </Link>
                </p>

                <p className="text-sm font-light text-gray-800">
                  Already have an account ?{" "}
                  <Link
                    to="/login"
                    onClick={() => window.scroll(0, 0)}
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
