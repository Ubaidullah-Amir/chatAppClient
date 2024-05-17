import { ErrorMessage, Field } from 'formik'
import React from 'react'
import TextError from './TextError'

export default function Input({label,name,...rest}) {
  return (
    <div className='formDiv'>
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} {...rest}/>
      <ErrorMessage  name={name} component={TextError}/>
    </div>
  )
}
