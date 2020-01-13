import React, { useEffect } from 'react'

import AuthUserContext from './context'

import { withFirebase, FirebaseProviderProps } from '../FirebaseProvider'

import history from 'utils/history'
import * as routes from 'utils/routes'

const withAuthorization = <Props extends object>(
  Component: React.ComponentType<Props>
) => {
  const WithAuthorization: React.FC<Props & FirebaseProviderProps> = props => {
    const { firebase } = props

    useEffect(() => {
      const unsubscribe = firebase.auth.onAuthStateChanged(
        authUser => {
          if (!authUser) {
            history.push(routes.login)
          }
        },
        () => history.push(routes.login)
      )

      return (): void => {
        unsubscribe()
      }
    }, [firebase])

    return (
      <AuthUserContext.Consumer>
        {(authenticated): React.ReactNode =>
          authenticated === true ? <Component {...(props as Props)} /> : ''
        }
      </AuthUserContext.Consumer>
    )
  }

  return withFirebase(WithAuthorization)
}

export default withAuthorization