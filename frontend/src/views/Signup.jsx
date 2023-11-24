import { useState } from 'react';
import {Link} from 'react-router-dom';
import axiosClient from '../axios'
import { userStateContext } from '../context/ContextProvider';

export default function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({__html:''});

  const {setCurrentUser,setUserToken} = userStateContext();

  const onSubmit = (ev) => {
    ev.preventDefault();
    axiosClient.post('/signup', {
      name,
      email,
      password,
      password_confirmation
    })
    .then( ({data}) => {    //Get Whole response but need to destructure response and get data
      setCurrentUser(data.user)
      setUserToken(data.token)
    })
    .catch( (error) => { //Get Whole error but need to destructure error and get response
      const finalError = Object.values(error.response.data.errors).reduce( (accum,next) => [  ...accum,...next],[]).join('<br>');
      setErrors({__html:finalError})

    })

  }

    return (
      <>
      
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up for free
          <p className='mt-2 text-center text-sm text-gray-600'>
            <Link 
              to='/login'
              className='font-medium text-indigo-600 hover:text-indigo-500'>
                Login with your account!
            </Link>
          </p>
          </h2>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

            {errors.__html && <div className="bg-red-600 text-white p-3 rounded" dangerouslySetInnerHTML={errors}>
                
            </div> }
            
            <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={ (ev) => setName(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
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
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={ (ev) => setPassword(ev.target.value) }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password Confirmation
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={password_confirmation}
                    onChange={ (ev) => setPasswordConfirmation(ev.target.value) }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </div>
            </form>
  
          </div>
      </>
    )
  }
  