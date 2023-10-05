import React from 'react'
import { Form } from 'react-bootstrap'

export default function Uploader({name,handleOnImageChange,imageSrc,touched,isError,errorMsg,onBlur}) {
  return (

    <div className='formDiv'>
      <input id="file" accept=".jpg, .jpeg, .png" name="file" type="file" onChange={handleOnImageChange} onBlur={onBlur} />
      {imageSrc ? (
        <img src={URL.createObjectURL(imageSrc)} width="200"/>
      ):null}
      
      {touched && isError ?(
          <Form.Text className="text-muted error-text">
            {errorMsg}
          </Form.Text>):""}
    </div>
  )
}