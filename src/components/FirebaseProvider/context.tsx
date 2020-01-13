import React from 'react'
import Firebase from './firebase'

const FirebaseContext = React.createContext({})

export interface FirebaseProviderProp {
  firebase: Firebase
}

export const FirebaseProvider: React.FC<FirebaseProviderProp> = ({
  firebase,
  children
}) => (
  <FirebaseContext.Provider value={firebase}>
    {children}
  </FirebaseContext.Provider>
)

interface WithFirebaseProps {
  firebase: Firebase
}

export const withFirebase = <P extends object>(
  Component: React.ComponentType<P>
) =>
  class WithFirebase extends React.Component<Omit<P, keyof WithFirebaseProps>> {
    render(): React.ReactNode {
      return (
        <FirebaseContext.Consumer>
          {(firebase): React.ReactNode => (
            <Component {...(this.props as P)} firebase={firebase} />
          )}
        </FirebaseContext.Consumer>
      )
    }
  }

export default FirebaseContext