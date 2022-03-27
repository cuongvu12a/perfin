import React from 'react'
import { KeyBoardEnum } from '@utility/constants'
import { Input } from 'reactstrap'

const TextArea = ({handleSubmit, ...rest}) => {

  const handleKeyDown = e => {
    if (e.key === KeyBoardEnum.Enter && !e.shiftKey) {
      e.preventDefault()
      if (!!handleSubmit) {
        handleSubmit()
      }
    }
  }

  return (
    <Input
      type='textarea'
      onKeyDown= {handleKeyDown}
      {...rest}
    />
  )
}

export default TextArea
