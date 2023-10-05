import React from 'react'
import BootstrapInput from './BootstrapInput';
import Input from './Input';
import Radio from './Radio';
import Select from './Select';
import TextArea from "./TextArea"
import Uploader from './Uploader';
export default function FormControl({control,...props}) {
  switch (control) {
    case "input":
        return <Input {...props}/>
    case "textarea":
        return <TextArea {...props}/>
    case "select":
      return <Select {...props}/>
    case "radio":
      return <Radio {...props}/>
    case "bootstarpInput":
      return <BootstrapInput {...props}/>
    case "uploader":
      return <Uploader {...props}/>
    default:
        break;
  }
}
