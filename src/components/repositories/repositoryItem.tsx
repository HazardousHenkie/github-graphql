import React from 'react'

import './resporityItem.scss'

import { useMutation } from '@apollo/react-hooks'
import { starRepository, unstarRepository } from './mutations'
import repositoryFragment from './fragments'
import { DataProxy } from 'apollo-cache'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import StarIcon from '@material-ui/icons/Star'
import VisibilityIcon from '@material-ui/icons/Visibility'

interface RepositoriesProps {
  id: number
  ownerLogin: string
  ownerUrl: string
  description: string
  primaryLanguage: string
  stargazers: number
  watchers: number
  name: string
  url: string
  viewerHasStarred: boolean
}

const RepositoryItem: React.FC<RepositoriesProps> = ({
  id,
  name,
  url,
  ownerLogin,
  ownerUrl,
  description,
  primaryLanguage,
  stargazers,
  watchers,
  viewerHasStarred
}) => {
  const [addStar] = useMutation(starRepository)
  const [removeStar] = useMutation(unstarRepository, { variables: { id } })

  // lees wieruch ding nog eens ff door
  // mss deze functions in apart bestand voor schoonheid

  const getUpdatedStarData = (
    proxy: DataProxy,
    id: number,
    viewerHasStarred: boolean
  ) => {
    const data: any = proxy.readFragment({
      id: `Repository:${id}`,
      fragment: repositoryFragment
    })

    let { totalCount } = data.stargazers
    totalCount = viewerHasStarred ? totalCount + 1 : totalCount - 1
    proxy.writeFragment({
      id: `Repository:${id}`,
      fragment: repositoryFragment,
      data: {
        ...data,
        stargazers: { ...data.stargazers, totalCount }
      }
    })
  }

  const addStarWrapper = () =>
    addStar({
      variables: { id },
      optimisticResponse: {
        addStar: {
          __typename: 'Mutation',
          // check how this works more deeply but probably its getting the paramaters inside strarable (like the query)
          starrable: {
            __typename: 'Repository',
            id,
            viewerHasStarred: !viewerHasStarred

            // can we put the whole thing here ? i think so
          }
        }
      },
      //i think since it's deep it need this update to tell us what to update or to prevent a full update//put this funciton in a seperate one outside of this one
      update: (
        proxy,
        {
          data: {
            addStar: {
              //same here get the data as mentioned above
              starrable: { id, viewerHasStarred }
            }
          }
        }
      ) => getUpdatedStarData(proxy, id, viewerHasStarred)
    })

  const removeStarWrapper = () =>
    removeStar({
      variables: { id },
      optimisticResponse: {
        removeStar: {
          __typename: 'Mutation',

          starrable: {
            __typename: 'Repository',
            id,
            viewerHasStarred: !viewerHasStarred
          }
        }
      },
      update: (
        proxy,
        {
          data: {
            removeStar: {
              starrable: { id, viewerHasStarred }
            }
          }
        }
      ) => getUpdatedStarData(proxy, id, viewerHasStarred)
    })

  return (
    <Card className="repository_card">
      <CardContent>
        <Typography
          className="repository_card__title"
          variant="h5"
          component="h3"
        >
          {name}
        </Typography>

        <Typography variant="body2" component="p">
          {description}
        </Typography>

        <div className="repository_card__buttons">
          <Button
            className="repository_card__button"
            variant="contained"
            color="secondary"
            startIcon={<VisibilityIcon />}
          >
            Watchers {watchers}
          </Button>

          {!viewerHasStarred ? (
            <Button
              className="repository_card__button"
              variant="contained"
              color="secondary"
              onClick={() => addStarWrapper()}
              startIcon={<StarIcon />}
            >
              Stars {stargazers}
            </Button>
          ) : (
            <Button
              className="repository_card__button"
              variant="contained"
              color="primary"
              onClick={() => removeStarWrapper()}
              startIcon={<StarIcon />}
            >
              Stars {stargazers}
            </Button>
          )}
        </div>

        <ul className="repository_card__list">
          <li>Language: {primaryLanguage}</li>
          <li>
            Owner:
            <a className="repository_card__link" href={ownerUrl}>
              {ownerLogin}
            </a>
          </li>
        </ul>

        <div className="repository_card__buttons">
          <Button variant="contained" color="primary" href={url}>
            Check on github
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RepositoryItem
