import { Form, Formik } from 'formik'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import * as Yup from "yup"
import FormControl from './formComponents/FormControl'
import { useMutation } from 'react-query'
import { useNavigate } from "react-router-dom";
import axios from  "axios"
import { UserContext } from './Main'
import { Link } from 'react-router-dom/dist/umd/react-router-dom.development'
import styles from "./login.module.css"
const baseURL=process.env.REACT_APP_API_URL

function funcPostSignUpUser(user_obj) {
  console.log("funcPostLoginUser",user_obj)
  return axios.post(`${baseURL}/user/signup`,user_obj)
}

const onError=(error)=>{
  console.log("fetched error ",error)

}

export default function SignUp() {
  const {setUser,setSelectedFriend}=useContext(UserContext)
  const navigate=useNavigate()
    const {error,isError,isLoading,mutate}=useMutation({mutationFn:funcPostSignUpUser,
      onSuccess:(data)=>{
        console.log("onSuccess data",data.data)
        setUser(data.data.user)
        setSelectedFriend("")
        navigate("/")
        
      },
      onError:onError
  })
    const validationSchema=Yup.object({
        name:Yup.string().required("Please enter User Name"),
        password:Yup.string().required("Please enter password"),
        email:Yup.string().email("Please enter proper email format").required("Please Enter Email")
    })
    
    const onSubmit=(values,onSubmitProps)=>{

      mutate(values)
      
      
    }
    const initialValues={
        name:"",
        password:"",
        email:"",
    }
    

  return (
    <div className='formContainer'>
        {isLoading?<p>can't you see it's loading! </p>:null}
        {isError?<p className="error-text">{error?.response.data.Msg} try again</p>:null}
      <Formik 
        initialValues={initialValues } 
        onSubmit={onSubmit} 
        validationSchema={validationSchema} 
      >
    {formik=>{
      console.log(formik)
      return (
        <Form className={styles.card}>
          <h2>Sign Up</h2>
          <fieldset className="container" >
          <FormControl
          className={styles.input}
              control="bootstarpInput" 
              name="name"
              label=" User Name"
              placeholder="Enter user name " 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              touched={formik.touched.name}
              isError={formik.errors.name?true:false}
              errorMsg={formik.errors.name}
              />
            <FormControl
            className={styles.input}
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
              className={styles.input}
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
              
              <button className = {styles.button} type='submit' disabled={!(formik.isValid) || !(formik.dirty)} >Sign Up</button>
              </fieldset>
              <p>Already have an account <Link to="/login">Login</Link></p>
        </Form>
    )
  }}
        
      </Formik>
      
      </div>
  )
}
