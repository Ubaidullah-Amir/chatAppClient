import React from 'react'
import { Form } from 'react-bootstrap'

export default function BootstrapInput(props) {
    const {name,label,touched,isError,value,errorMsg, ...rest}=props
    return (
      <Form.Group className='formDiv' controlId={name}>
          <Form.Label>{label}</Form.Label>
          <Form.Control 
          className={touched && isError ? "error" : null}
          {...rest}
          name={name}
          value={value}
          />
          {touched && isError ?(
          <Form.Text className="text-muted error-text">
            {errorMsg}
          </Form.Text>):""}
      </Form.Group>
  )
}