import { ErrorMessage, Field } from 'formik'
import React, { Fragment } from 'react'
import TextError from './TextError'

export default function Radio({label,name,options,...rest}) {
  return (
    <div className='formDiv'>
    <label>{label}</label>
    <Field  name={name} {...rest}>
    {
        ({field})=>{
            return options.map((option)=>{
                return(
                    <Fragment key={option.key}>
                        <input type='radio'
                            id={option.value}
                            {...field} 
                            value={option.value}
                            checked={field.value===option.value}
                        />
                        <label htmlFor={option.vlaue}>{option.key}</label>
                    </Fragment>
                )
            })
        }
    }
    </Field>
        
      
      <ErrorMessage name={name} component={TextError}/>
    </div>
  )
}
