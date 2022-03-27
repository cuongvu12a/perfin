import { FormattedMessage } from 'react-intl'
import { ReactSortable } from 'react-sortablejs'
import { Badge } from 'reactstrap'

const QueueColumn = ({ title, group, list, isDisable, setList, onAdd, renderItem }) => {
  return (
    <div className='queue-column-container'>
      <div className='d-flex flex align-items-center'>
        <h2 className='queue-title'>
          <FormattedMessage id={`title.${title}`} defaultMessage={title} />
        </h2>
        <Badge color='primary' pill className='queue-pill'>
          {list?.length}
        </Badge>
      </div>
      <div className='queue-column'>
        <ReactSortable
          tag='div'
          id={title}
          className='sortable'
          group={group}
          animation={500}
          sort={false}
          disabled={isDisable}
          onAdd={onAdd}
          list={list}
          setList={setList}
        >
          {list?.map(item => renderItem(item))}
        </ReactSortable>
      </div>
    </div>
  )
}

export default QueueColumn
