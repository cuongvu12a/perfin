import React from 'react'
import { Label, Input, FormGroup, Row, Col, CustomInput } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { SkillsEnum } from '@utility/constants'
import { Controller } from 'react-hook-form'

const SkillsTabContent = ({ isEditable, control }) => {
  return (
    <>
      <h2>
        <FormattedMessage id='title.skills' defaultMessage='Skills' />
      </h2>
      <Row className='mt-2'>
        <Controller
          control={control}
          name='skillIds'
          render={({ onChange, value }) => (
            <>
              {SkillsEnum.map(skill => (
                <Col sm='6' key={skill.skillId}>
                  <FormGroup>
                    <CustomInput
                      type='checkbox'
                      id={skill.skillId}
                      checked={!!value.find(c => c === skill.skillId)}
                      disabled={!isEditable}
                      onChange={e => {
                        if (e.target.checked) {
                          onChange([...value, ...[skill.skillId]])
                        } else {
                          const newIds = value.filter(id => id !== skill.skillId)
                          onChange(newIds)
                        }
                      }}
                      label={<FormattedMessage id={skill.skillLabel} defaultMessage={`${skill.skillLabel}`} />}
                    />
                  </FormGroup>
                </Col>
              ))}
            </>
          )}
        />
      </Row>
    </>
  )
}

export default SkillsTabContent
