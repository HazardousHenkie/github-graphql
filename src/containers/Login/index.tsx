import React, { useContext } from 'react'

import { Redirect } from 'react-router-dom'

import { AuthUserContext } from 'components/AuthenticationProvider'

import Grid from '@material-ui/core/Grid'

import Background from 'components/BackgroundImage'

import SignInGithub from './signInGithub'

import { login } from 'utils/strings'
import { home } from 'utils/routes'

import {
  LoginStyled,
  LoginTitleStyled,
  LoginFormStyled,
  PaperStyled
} from './styledComponents/login'

const Login: React.FC = () => {
  const { authenticated } = useContext(AuthUserContext)

  if (authenticated) {
    return <Redirect to={home} />
  }

  return (
    <LoginStyled container spacing={2} justify="center" alignItems="center">
      <Grid item xs={12} sm={7} md={5}>
        <Background />

        <LoginFormStyled>
          <PaperStyled>
            <LoginTitleStyled variant="h2">{login}</LoginTitleStyled>

            <SignInGithub />
          </PaperStyled>
        </LoginFormStyled>
      </Grid>
    </LoginStyled>
  )
}

export default Login
