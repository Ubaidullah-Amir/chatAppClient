import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap'
import * as Yup from "yup"
import FormControl from './formComponents/FormControl'
import { useMutation } from 'react-query'
import { Form, Formik } from 'formik'
import axios from 'axios'
const baseURL=process.env.REACT_APP_API_URL

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
    
function ModalProfileEdit({user,setUser}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {error,isError,isLoading,mutate}=useMutation({mutationFn:funcPostModifyUser,
      onSuccess:(data)=>{
        console.log("fetched modified user data")
        setUser((prevState)=>({...data.data.upadatedUser,friend:prevState.friend}))
      },
      onError:onError
  })
  const initialValues={
      image:user.image || "",
      name:user.name,
      password:user.password
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
      mutate(formData)
      handleClose()
    }
  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Edit Profile
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Formik 
        initialValues={initialValues } 
        onSubmit={onSubmit} 
        validationSchema={validationSchema} 
      >
    {formik=>{
      return (
        <Form >
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
        </Modal.Body>
        
      </Modal>
    </div>
  );
}


export default ModalProfileEdit;