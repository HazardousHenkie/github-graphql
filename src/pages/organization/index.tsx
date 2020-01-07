import React, { useState } from 'react'
import { compose } from 'recompose'

import Search from '../../components/search'
import Loading from '../../components/loading'
import Repositories from '../../components/repositories'
import InfoMessage from '../../components/infoMessage'

import { WithAuthorization } from '../../components/authentication'
import Background from '../../components/background'

import ErrorMessage from '../../components/errorMessage'

import getRepositoriesForOrganization from '../../queries/organization'
import { useQuery } from '@apollo/react-hooks'

import './organization.scss'

const Organization: React.FC = () => {
  const [organizationName, setSearch] = useState('')

  const noOrganization = organizationName === ''

  const { loading, error, data, fetchMore } = useQuery(
    getRepositoriesForOrganization,
    {
      variables: { organizationName },
      skip: noOrganization,
      notifyOnNetworkStatusChange: true
    }
  )

  return (
    <div className="organization">
      <Background />

      <div className="organization__inner">
        <InfoMessage infoMessage="Only OAuth Apps you authorized in your Github account can be searched for." />

        <Search setSearch={setSearch} />

        {noOrganization && (
          <ErrorMessage errorMessage="No organization filled in." />
        )}

        {error && <ErrorMessage errorMessage={error.toString()} />}

        {loading && !data && <Loading />}

        {!loading && !error && data && !noOrganization && (
          <Repositories
            loading={loading}
            fetchMore={fetchMore}
            repositories={data.organization.repositories}
            entry={'organization'}
          />
        )}
      </div>
    </div>
  )
}

export default compose(React.memo, WithAuthorization)(Organization)
