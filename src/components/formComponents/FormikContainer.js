import {Form, Formik } from 'formik'
import * as Yup from "yup"
import React, { useState } from 'react'
import FormControl from './FormControl'
import { Button } from 'react-bootstrap'


const dropDownOptions=[
  {key:"select an option", value:""},
  {key:"male",value:"male is selected"},
  {key:"female",value:"female is selected"},
]
const TelephoneTypeRadioOption=[
  {key:"land Line",value:"male is selected"},
  {key:"Telephone",value:"female is selected"},
]

const initailValues={
  username:"uabid",
  age:0,
  email:"",
  description:"",
  selectGender:"",
  phoneNumberType:"",
  bootstarpEmail:"testing@aldskjf",
}
const onSubmit=prop=>(
  console.log("formdata value",prop)
)
const validationSchema=Yup.object({
  bootstarpEmail:Yup.string().required("Please enter Email"),
  phoneNumberType:Yup.string().required("select a Phone Number Type"),
  selectGender:Yup.string().required("select a gender"),
  username:Yup.string().min(5,"enter atleast 5 letters").max(30,"less than 30 letters").required("Please Enter UserName"),
  age:Yup.number().min(18,"minimum 18 required").max(30,"maximum 30 required").required("Please Enter age"),
  email:Yup.string().email("Email Formate Error").min(5,"enter atleast 5 letters").max(30,"less than 30 letters").required("Please Enter Email"),
  description:Yup.string().min(5,"enter atleast 5 letters").max(30,"less than 30 letters").required("Please Enter description"),
})


export default function FormikContainer() {
  // const [emaildisabled,setemailDisabled]=useState(false)
  
  return (<>
    {/* <Button type="button" onClick={()=>setemailDisabled((prevState)=>!prevState)} variant="primary">Toggle diability</Button> */}
      <Formik 
        initialValues={initailValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        >
          

          {
            formik=>{
              console.log("signup form values",formik.values)
              return (
             <Form className='container'>
                <FormControl
                control="input" 
                name="username"
                label="User Name"
                />
                <FormControl
                control="input" 
                name="age"
                label="Age"
                type="number"
                />
                <FormControl
                control="radio" 
                label="Select a phone Number type"
                name="phoneNumberType"
                options={TelephoneTypeRadioOption}
                />
                <FormControl
                control="select" 
                name="selectGender"
                label="Gender"
                options={dropDownOptions}
                />
                <FormControl
                control="input" 
                name="email"
                label="Email"
                />
                <FormControl
                control="textarea" 
                name="description"
                label="Description"
                />
              <FormControl
              control="bootstarpInput" 
              name="bootstarpEmail"
              label="bootstarp Email"
              placeholder="Enter email " 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bootstarpEmail}
              touched={formik.touched.bootstarpEmail}
              isError={formik.errors.bootstarpEmail?true:false}
              errorMsg={formik.errors.bootstarpEmail}
              />

                <button type='submit'>Submit</button>
              </Form>
             )}
            }
            
      </Formik>
      </>
  )
}
