import { useState, useEffect, useCallback, useRef } from 'react'

export default function useInfiniteScrolling({ queryFunc, handleError, dependency }) {
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const { pageData, paging } = await queryFunc({ pageNumber }).then(res => res.data)
      setData(prevData => [...prevData, ...pageData])
      setHasMore(paging.totalItem === paging.pageSize)
      setIsLoading(false)
    } catch (error) {
      handleError(error)

      setIsLoading(false)
      setIsError(true)
    }
  }, [...dependency, pageNumber])

  const observer = useRef()

  const lastElementRef = useCallback(node => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prePageNumber => prePageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  })

  return { data, hasMore, isError, isLoading, lastElementRef }
}
