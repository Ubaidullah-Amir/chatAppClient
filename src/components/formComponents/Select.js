import { ErrorMessage, Field } from 'formik'
import React from 'react'
import TextError from './TextError'

export default function Select({label,name,options,...rest}) {
  return (
    <div className='formDiv'>
      <label htmlFor={name}>{label}</label>
      <Field as="select" id={name} name={name} {...rest} >
        {options.map((option)=>{
                return (
                    <option key={option.key} value={option.value}>
                        {option.key}
                    </option>
                )
            })
        }
      </Field>
      <ErrorMessage name={name} component={TextError}/>
    </div>
  )
}
