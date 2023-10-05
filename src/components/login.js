import { Form, Formik } from 'formik'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import * as Yup from "yup"
import FormControl from './formComponents/FormControl'
import { useMutation } from 'react-query'
import { Link, useNavigate } from "react-router-dom";
// import {  } from '../utils/reactQuery'
// import {PostUserQuery,FetchUserQuery} from "../../utilities/UseMutation"
import axios from  "axios"
import { UserContext } from './Main'

const baseURL="http://localhost:3030"

function funcPostLoginUser(user_obj) {
  console.log("funcPostLoginUser",user_obj)
  return axios.post(`${baseURL}/user/login`,user_obj)
}

const onError=(error)=>{
  console.log("fetched error ",error.response.data.Msg)

}

export default function Login() {
  const navigate=useNavigate()
  const {setUser,setSelectedFriend}=useContext(UserContext)
    // const [formDisabled,setformDisabled]=useState(false)
    const {error,isError,isLoading,mutate}=useMutation({mutationFn:funcPostLoginUser,
      onSuccess:(data)=>{
        console.log("fetched data",data.data)
        setUser(data.data.user)
        setSelectedFriend("")
        navigate("/")
      },
      onError:onError
  })
    
    // const {isError:fetchUserIsError,data:fetchUserData,refetch:fetchUserRefetch,isFetching:fetchUserIsFetching}=FetchUserQuery(specificUser,onSuccess,onError)
    // const [loadedFormValues,setloadedFormValues]=useState(null)

    // useEffect(()=>{
    //   if(window.confirm("you want to load initial data")){
    //     setformDisabled(true)
    //     fetchUserRefetch()
    //   }
    // },[])

    // useEffect(()=>{
    //   if(!fetchUserIsFetching && formDisabled){
    //     console.log("fetching completed")
    //     if(!fetchUserIsError){
          
    //       const {id,...values}=Array.isArray(fetchUserData.data)?(fetchUserData.data[1]):fetchUserData.data


    //       setloadedFormValues(values)
    //       setformDisabled(false)
    //       console.log("fetching user data",fetchUserData)
    //       console.log("fetching user errro",fetchUserIsError)
    //     }else{
    //       setformDisabled(false)
    //       console.log("fetch user error found",fetchUserIsError)
    //     }

        
    //   }
    // },[fetchUserIsFetching])

    const validationSchema=Yup.object({
        password:Yup.string().required("Please enter password"),
        email:Yup.string().required("Please Enter Email")
    })
    const onSubmit=(values,onSubmitProps)=>{
      mutate(values)
    }
    const initialValues={
        password:"",
        email:"",
    }
    

  return (
    <div>
        {isLoading?<p>it's loading! </p>:null}
        {isError?<p className="error-text">{error?.response.data.Msg} try again</p>:null}
        {/* {fetchUserIsFetching?<p>wait your request data is beign fetch</p>:null}
        {fetchUserIsError?<p>your data not found</p>:null} */}
      <Formik 
    //   initialValues={loadedFormValues ||initialValues } 
        initialValues={initialValues } 
        onSubmit={onSubmit} 
        validationSchema={validationSchema} 
      >
    {formik=>{
      return (
        <Form >
          <fieldset className="container" >
            <FormControl
              control="bootstarpInput" 
              name="email"
              label="Email"
              placeholder="Enter email " 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              touched={formik.touched.email}
              isError={formik.errors.email?true:false}
              errorMsg={formik.errors.email}
              />
              
              <FormControl
              type="password"
              control="bootstarpInput" 
              name="password"
              label=" Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              touched={formik.touched.password}
              isError={formik.errors.password?true:false}
              errorMsg={formik.errors.password}
              />
              {/* <Button type='submit' disabled={!( formik.isValid && formik.submitCount<3 && !formik.isSubmitting)}>Add User</Button> */}
              <Button type='submit' >Login</Button>
              </fieldset>
        </Form>
    )
  }}
        
      </Formik>
      <p>don't have an account <Link to="/signup">Sign Up</Link></p>
      </div>
  )
}
