import React from 'react'
import Button from '@material-ui/core/Button'
import Loading from '../../components/loading'

interface FetchMoreProps {
  loading: boolean
  hasNextPage: boolean
  variables: Record<string, string | number>
  updateQuery: Record<string, any>
  fetchMore: any
}

const FetchMore: React.FC<FetchMoreProps> = ({
  loading,
  hasNextPage,
  variables,
  updateQuery,
  fetchMore,
  children
}) => (
  <React.Fragment>
    {loading ? (
      <Loading />
    ) : (
      hasNextPage && (
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={() => fetchMore({ variables, updateQuery })}
        >
          More {children}
        </Button>
      )
    )}
  </React.Fragment>
)
export default FetchMore
