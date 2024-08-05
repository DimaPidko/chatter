import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserName, setUserId } from "./FormToLoginSlice";
import { useForm, SubmitHandler } from "react-hook-form";

interface LoginFormInputs {
  userName: string;
  userPassword: string;
}

const FormToLogin: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state: any) => state.theme);
  
  useEffect(() => {
    login();
  }, []);
  
  const login = async () => {
    if (!localStorage.getItem("token")) {
      return;
    } else {
      const response = await fetch("http://localhost:3307/auto-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });
      
      if (response.status === 200) {
        const user = await response.json();
        dispatch(setUserName(user.userName));
        dispatch(setUserId(user.userId));
        navigate("/chats");
      }
    }
  };
  
  const onLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    const { userName, userPassword } = data;
    
    const response = await fetch("http://localhost:3307/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, userPassword }),
    });
    
    if (response.status === 200) {
      const user = await response.json();
      dispatch(setUserName(user.userName));
      dispatch(setUserId(+user.userId));
      localStorage.setItem("token", user.token);
      navigate("/chats");
    } else {
      alert("Login failed");
    }
  };
  
  return (
    <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} flex items-center justify-center h-screen`}>
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-500 hover:scale-105`}>
        <h2 className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} text-2xl font-bold mb-6 text-center`}>Log In</h2>
        <form
          onSubmit={handleSubmit(onLogin)}
          className="flex flex-col space-y-4"
        >
          <input
            placeholder="Enter user name..."
            {...register("userName", {
              required: "User name is required",
              minLength: {
                value: 3,
                message: "User name must be at least 3 characters long",
              },
              maxLength: {
                value: 20,
                message: "User name must be less than 20 characters long",
              },
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "User name must contain only letters and numbers",
              },
            })}
            className={`${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-700 text-gray-200 border-gray-600'} text-xl p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.userName && (
            <span className="text-red-500">{errors.userName.message}</span>
          )}
          
          <input
            placeholder="Enter password"
            type="password"
            {...register("userPassword", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
              maxLength: {
                value: 20,
                message: "Password must be less than 20 characters long",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: "Password must contain letters and numbers",
              },
            })}
            className={`${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-700 text-gray-200 border-gray-600'} text-xl p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.userPassword && (
            <span className="text-red-500">{errors.userPassword.message}</span>
          )}
          
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
          >
            LOGIN
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormToLogin;
