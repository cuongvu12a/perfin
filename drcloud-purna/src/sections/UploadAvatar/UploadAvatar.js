import React, { useEffect, useState } from 'react'
import { Button, Input, Label, Media } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

import { createPhysicalFileAPI, putUploadImageAPI, putUploadDoneAPI } from '@api/main'
import defaultAvatar from '@assets/images/avatar-blank.png'
import Toast from '@utility/toast'
import { getErrorMessage } from '@api/handleApiError'
import UILoader from '@core/components/ui-loader'
import { Edit } from 'react-feather'

const UploadAvatar = ({ physicalFileType, image, setFileId }) => {
  const [file, setFile] = useState()
  const [previewFile, setPreviewFile] = useState(defaultAvatar)
  const [physicalFile, setPhysicalFile] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!!image) {
      setPreviewFile(image)
    }
  }, [image])

  const onUploadChange = async e => {
    if (!!e.target.files[0]) {
      setFile(e.target.files[0])
      const res = await createPhysicalFileAPI({
        fileName: e.target.files[0].name,
        fileLength: e.target.files[0].size,
        physicalFileType
      })
      setPhysicalFile(res.data)

      const reader = new FileReader(),
        files = e.target.files
      reader.onload = function () {
        setPreviewFile(reader.result)
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleUpload = async () => {
    try {
      setIsLoading(true)
      await putUploadImageAPI(physicalFile.presignedUploadUrl, file)
      await putUploadDoneAPI(physicalFile.physicalFileId)
      setFileId(physicalFile.physicalFileId)

      Toast.showSuccess('toast.success', 'toast.uploadDone')
    } catch (error) {
      Toast.showError('toast.error', getErrorMessage(error))
    } finally {
      setIsLoading(false)
      setFile()
    }
  }

  const handleRemove = () => {
    setFileId(null)
    setPreviewFile(defaultAvatar)
    setFile()
    setPhysicalFile()
  }

  return (
    <Media>
      <Media className='mr-25 rounded-circle' left>
        <Label className='image-wrapper'>
          <div className='image-upload'>
            <Input type='file' onChange={onUploadChange} hidden accept='image/*' />
            <UILoader blocking={isLoading} className='rounded-circle'>
              <Media
                object
                className='rounded-circle '
                style={{ objectFit: 'cover' }}
                src={previewFile}
                alt='Generic placeholder image'
                height='70'
                width='70'
              />
              <Edit size={18} color='white' className='overlay-icon' />
            </UILoader>
          </div>
        </Label>
      </Media>
      <Media className='mt-75 ml-1' body>
        <Button onClick={handleUpload} className='mr-75 mb-0' size='sm' color='primary' disabled={!file || isLoading}>
          <FormattedMessage id='button.upload' defaultMessage='Upload' />
        </Button>
        <Button color='secondary' size='sm' onClick={() => handleRemove()} outline>
          <FormattedMessage id='button.remove' defaultMessage='Remove' />
        </Button>
        <br />
        <div className='mt-75'>
          <FormattedMessage id='settings.imageDescription' defaultMessage='Allowed JPG, GIF or PNG. Max size of 2MB' />
        </div>
      </Media>
    </Media>
  )
}

export default UploadAvatar
