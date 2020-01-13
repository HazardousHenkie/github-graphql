import React from 'react'

import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import {
  withFirebase,
  FirebaseProviderProps
} from 'components/FirebaseProvider'

import { setUser } from 'redux/actions'

import * as routes from 'utils/routes'
import history from 'utils/history'

import useSnackbarContext from 'components/snackbar/context'

const useStyles = makeStyles(() => ({
  button: {
    marginBottom: '10px'
  }
}))

export const SignOutButton: React.FC<FirebaseProviderProps> = ({
  firebase
}) => {
  const dispatch = useDispatch()
  const { setSnackbarState } = useSnackbarContext()
  const classes = useStyles()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()

    firebase.doSignOut().then(
      () => {
        dispatch(
          setUser({
            loggedIn: false,
            userName: '',
            userId: '',
            authToken: null
          })
        )
        setSnackbarState({ message: 'Logged out', variant: 'error' })
        history.push(routes.login)
      },
      error => {
        setSnackbarState({ message: 'Sign Out Error', variant: 'error' })
        error('Sign Out Error', error)
      }
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      color="secondary"
      className={classes.button}
    >
      Sign Out
    </Button>
  )
}

export default withFirebase(SignOutButton)