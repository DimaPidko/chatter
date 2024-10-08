import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import Guid from 'guid';
import { resetData } from './FormToRegisterSlice.ts';

interface RegisterFormInputs {
  userName: string;
  userPassword: string;
}

const FormToRegister: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state: any) => state.theme);
  
  const onSubmitRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
    const { userName, userPassword } = data;
    
    const requestData = {
      id: Guid.create(),
      userName,
      userPassword,
      registrationDate: new Date().getTime(),
      lastActivity: new Date().getTime()
    };
    
    try {
      const response = await fetch('http://localhost:3307/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      // dispatch(resetData());
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} flex items-center justify-center h-screen`}>
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-500 hover:scale-105`}>
        <h2 className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-100'} text-2xl font-bold mb-6 text-center`}>Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmitRegister)} className="flex flex-col space-y-4">
          <input
            placeholder="Create user name..."
            {...register('userName', {
              required: 'User name is required',
              minLength: { value: 3, message: 'User name must be at least 3 characters long' },
              maxLength: { value: 20, message: 'User name must be less than 20 characters long' },
              pattern: { value: /^[A-Za-z0-9]+$/, message: 'User name must contain only letters and numbers' }
            })}
            className={`${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-700 text-gray-200 border-gray-600'} text-xl p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.userName && <span className="text-red-500">{errors.userName.message}</span>}
          
          <input
            placeholder="Create password"
            type="password"
            {...register('userPassword', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters long' },
              maxLength: { value: 20, message: 'Password must be less than 20 characters long' },
              pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: 'Password must contain letters and numbers' }
            })}
            className={`${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-700 text-gray-200 border-gray-600'} text-xl p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.userPassword && <span className="text-red-500">{errors.userPassword.message}</span>}
          
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
          >
            Create user
          </button>
          <Link to="/" className="text-center text-blue-500 hover:underline">Log In</Link>
        </form>
      </div>
    </div>
  );
};

export default FormToRegister;
