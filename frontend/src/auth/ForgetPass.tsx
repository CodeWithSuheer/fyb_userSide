import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgetuserAsync } from "../features/authSlice";
import { useDispatch } from "react-redux";

const ForgetPass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    dispatch(forgetuserAsync(formData)).then(() => {
      navigate("/otp");
      setFormData({
        email: "",
      });
    });
  };

  return (
    <>
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
                Forget Password
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* EMAIL */}
                <div>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md block w-full p-3"
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

                <button
                  type="submit"
                  className="w-full py-2.5 mx-auto bg-[#EC72AF] text-white flex justify-center tracking-wide"
                >
                  SUBMIT NOW
                </button>

                <p className="text-sm font-light text-gray-800">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Sign up
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

export default ForgetPass;
