import React from 'react'
import NotificationCard from './NotificationCard'
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized'

const NotificationListing = ({ notifications, hasMore, loadMore, handleMarkANotiAsRead, handleDeleteNoti }) => {
  const isRowLoaded = ({ index }) => {
    return !!notifications[index]
  }

  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      <NotificationCard
        notification={notifications[index]}
        handleMarkANotiAsRead={handleMarkANotiAsRead}
        handleDeleteNoti={handleDeleteNoti}
      />
    </div>
  )

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMore}
      rowCount={hasMore ? notifications.length + 1 : notifications.length}
    >
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              ref={registerChild}
              className='media-list scrollable-container'
              height={420}
              onRowsRendered={onRowsRendered}
              rowCount={notifications.length}
              rowHeight={105}
              overscanRowCount={1}
              rowRenderer={rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  )
}

export default NotificationListing
