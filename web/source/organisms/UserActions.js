/* @flow */
import React, { Component } from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { compose } from "recompose"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import withLoggedIn from "../containers/withLoggedIn"

import type { FirebaseType } from "../types/FirebaseType"

import Row from "../templates/Row"
import Button from "../atoms/Button"

const ProfilePicture = styled.img`
  max-width: 2rem;
  max-height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  border-radius: 100%;
  margin-right: 1rem;
  border: 2px solid white;
`

type Props = {
  firebase: FirebaseType,
  firestore: any,
  uid: string,
}

type State = {
  profilePicture: string,
}

class LoginForm extends Component<Props, State> {
  static defaultProps = {}
  state = { profilePicture: "#" }
  async componentDidMount() {
    const { uid, firestore } = this.props
    const fitbitUser = await firestore
      .collection("fitbit_users")
      .doc(uid)
      .get()
    const user = await fitbitUser.data()
    this.setState({ profilePicture: user.profile.avatar })
  }
  render() {
    const { firebase } = this.props
    return (
      <Row>
        <a href="/profile">
          <ProfilePicture src={this.state.profilePicture} />
        </a>
        <Button onClick={firebase.logout}>Logout</Button>
      </Row>
    )
  }
}

export default compose(
  withFirebase,
  firestoreConnect(),
  withLoggedIn({ showLogin: false }),
  connect(state => ({ uid: state.firebase.auth.uid })),
)(LoginForm)
