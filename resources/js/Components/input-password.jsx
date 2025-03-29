import { useState } from "react"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Eye, EyeOff } from 'lucide-react';

export const InputPassword = ({ value, onChange, ...rest }) => {
  const [show, setShow] = useState(false)

  return (
    <div className='relative'>
      <Input value={value} onChange={onChange} type={!show ? 'password' : 'text'} className="pr-12" {...rest} />
      <Button type="button" onClick={() => setShow(!show)} className="absolute top-0 right-0" variant="ghost" size="icon" tabIndex={-1}>
        {!show ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}
