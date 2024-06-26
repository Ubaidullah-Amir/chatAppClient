import React from 'react'
import { Form } from 'react-bootstrap'

export default function Uploader({name,handleOnImageChange,imageSrc,touched,isError,errorMsg,onBlur}) {
  return (

    <div className='formDiv'>
      {typeof(imageSrc) != "string" ? (
        <img className='imgUploadProfile' src={URL.createObjectURL(imageSrc)} width="200"/>
      ):<img className='imgUploadProfile' src={imageSrc} width="200"/>}
      
      <input className='uploadInputField' id="file" accept=".jpg, .jpeg, .png" name="file" type="file" onChange={handleOnImageChange} onBlur={onBlur} />
      {/* image is either user current image or if changed to selected File so createUrl function */}
      
      {touched && isError ?(
          <Form.Text className="text-muted error-text">
            {errorMsg}
          </Form.Text>):""}
    </div>
  )
}