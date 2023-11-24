import { useState } from 'react';
import {Link} from 'react-router-dom';
import axiosClient from '../axios';
import { userStateContext } from '../context/ContextProvider';

export default function Login() {
    const {setCurrentUser,setUserToken} = userStateContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({__html:''});
 
    const onSubmit = (ev) => {
      ev.preventDefault();
      
      axiosClient.post('/login',{
        email,
        password
      })
      .then( ({data}) => {
        setCurrentUser(data.user)
        setUserToken(data.token)
      
      })
      .catch( (error) => {
        const finalError = Object.values(error.response.data.errors).reduce( (accum,next) => [...accum,...next],[]).join('<br>');
        setErrors({__html:finalError})
      })


    }

    return (
      <>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
              <p className="mt-2 text-center text-sm">
                <Link 
                  to='/signup'
                  className='font-medium text-indigo-600 hover:text-indigo-500'>
                  Sign Up your account
                </Link>
              </p>
          </h2>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

            {errors.__html && <div className="bg-red-500 text-white rounded p-3" dangerouslySetInnerHTML={errors}>

            </div> }

            <form onSubmit={onSubmit} className="space-y-6" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={ (ev) => setEmail(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={ (ev) => setPassword(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Start a 14 day free trial
              </a>
            </p>
          </div>
      </>
    )
  }
  