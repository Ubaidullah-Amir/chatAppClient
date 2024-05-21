import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap'
import * as Yup from "yup"
import FormControl from './formComponents/FormControl'
import { useMutation } from 'react-query'
import { Form, Formik, useFormikContext } from 'formik'
import axios from 'axios'
import { EditOutlined } from '@ant-design/icons';
const baseURL=process.env.REACT_APP_API_URL
async function uploadFile(file) {
 
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${baseURL}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};


function funcPostModifyUser(formData) {
      return axios.post(`${baseURL}/user/modify`,formData)
}
const onError=(error)=>{
    console.log("fetched error ",error.response.data.Msg)
  
}
    
function ModalProfileEdit({user,setUser}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const FormIkRef = useRef(null);
  
   

  const {error,isError,isLoading,mutate}=useMutation({mutationFn:funcPostModifyUser,
      onSuccess:(data)=>{
        console.log("fetched modified user data")
        setUser((prevState)=>({...data.data.upadatedUser,friend:prevState.friend}))
        handleClose()
      },
      onError:onError
  })
  const { mutate:uploadFileMutation } = useMutation(uploadFile, {
    onSuccess: (imageObj) => {
        // Handle success
        console.log('File uploaded successfully:', imageObj);
        const req_body = {
            id:user._id,
            name:FormIkRef.current.values.name,
            password:FormIkRef.current.values.password,
            image:imageObj.url
        }
        mutate(req_body)

        
    },
    onError: (error) => {
        // Handle error
        console.error('Error uploading file:', error);
    }
    });
  const initialValues={
      image:user.image || "",
      name:user.name,
      password:"",
      confirmPassword:""
  }
  const validationSchema = Yup.object().shape({
    image: Yup.mixed().required('Please upload an image'),
    password: Yup.string().required("Please enter password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    name: Yup.string().required("Please enter name")
  });

  async function handleOnImageChange(event,formik){
    if( !event.currentTarget.files.length){
      formik.setFieldValue("image",user.image || "")
    }else{
      const file = event.currentTarget.files[0];
      formik.setFieldValue("image",file)
}
  }
  const onSubmit=(values)=>{
    console.log("values",FormIkRef.current.values)
    if( typeof FormIkRef.current.values.image === "string"){
      console.log("image not added using existing")
      const req_body = {
        id:user._id,
        name:FormIkRef.current.values.name,
        password:FormIkRef.current.values.password,
        image:FormIkRef.current.values.image
    }
    mutate(req_body)
    }else{
      console.log("image added")
      uploadFileMutation(FormIkRef.current.values.image)
}

      

    }
  return (
    <div>
      <Button style={{padding:"0 0.5em",marginTop:"0.5em"}} onClick={handleShow}>
      Edit Profile <EditOutlined /> 
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
        innerRef={FormIkRef}
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
                label="New Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                touched={formik.touched.password}
                isError={formik.errors.password?true:false}
                errorMsg={formik.errors.password}
                />
                <FormControl
                type="password"
                control="bootstarpInput" 
                name="confirmPassword"
                label="Confirm Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                touched={formik.touched.confirmPassword}
                isError={formik.errors.confirmPassword?true:false}
                errorMsg={formik.errors.confirmPassword}
                />
              {/* <Button type='submit' disabled={!( formik.isValid && formik.submitCount<3 && !formik.isSubmitting)}>Add User</Button> */}
              <Button style={{marginTop:"10px",fontSize:"13px"}} type='submit' disabled={!formik.isValid  || formik.isSubmitting || !formik.dirty}>Save Changes</Button>
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