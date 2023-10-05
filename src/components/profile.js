import { Form, Formik } from 'formik'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import * as Yup from "yup"
import FormControl from './formComponents/FormControl'
import { useMutation } from 'react-query'
import { useNavigate } from "react-router-dom";
import { UserContext } from './Main'
import axios from 'axios'



const baseURL="http://localhost:3030"

function funcPostModifyUser(formData) {
  return axios.post(`${baseURL}/user/modify`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
const onError=(error)=>{
    console.log("fetched error ",error.response.data.Msg)
  
}

export default function Profile() {
    const {user,setUser}=useContext(UserContext)
    console.log("users in profilte",user)
    const Navigate = useNavigate()
    useEffect(()=>{
        if(!user){
            Navigate("/login")
        }
    },[])
    const {error,isError,isLoading,mutate}=useMutation({mutationFn:funcPostModifyUser,
        onSuccess:(data)=>{
          console.log("fetched data",data.data)
          setUser((prevState)=>({...data.data.upadatedUser,friend:prevState.friend}))
        },
        onError:onError
    })
    const initialValues={
        image:"",
        name:"",
        password:""
    }
    const validationSchema = Yup.object().shape({
        image: Yup.mixed().required('Please upload an image'),
        password:Yup.string().required("Please enter password"),
        name:Yup.string().required("Please Enter name")
    });

    async function handleOnImageChange(event,formik){
        const file = event.currentTarget.files[0];
        formik.setFieldValue("image",file)

    }
    const onSubmit=(values,onSubmitProps)=>{

        const formData = new FormData();

        

        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, values[key]);
            }
        }
        formData.append("id", user._id);
        console.log("formData",formData,values)
        mutate(formData)
      }
    return (
        <div>
            <Formik 
        initialValues={initialValues } 
        onSubmit={onSubmit} 
        validationSchema={validationSchema} 
      >
    {formik=>{
      return (
        <Form >
            {console.log("formik",formik)}
          <fieldset className="container" >
            <FormControl
                control="uploader" 
                name="image"
                imageSrc={formik.values.image}
                handleOnImageChange={(e)=>handleOnImageChange(e,formik)}
                onBlur={formik.handleBlur}
                touched={formik.touched.image}
                isError={formik.errors.image?true:false}
                errorMsg={formik.errors.image}
                />
            <FormControl
                type="name"
                control="bootstarpInput" 
                name="name"
                label=" Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                touched={formik.touched.name}
                isError={formik.errors.name?true:false}
                errorMsg={formik.errors.name}
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
              <Button type='submit' disabled={!formik.isValid  || formik.isSubmitting || !formik.dirty}>Modify</Button>
              </fieldset>
        </Form>
    )
  }}
        
      </Formik>
            <p>{user.image?user.image:"no image found"}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.password}</p>
            
            <br></br>
            {user.friend?.map(friend=>{
                return (<div key={friend._id}>
                    <p>{friend.image?friend.image:"no image found"}</p>
                    <p>{friend.name}</p>
                    <p>{friend.email}</p>
                    <p>{friend.password}</p>
                </div>)
            })}
        </div>
    );
}
