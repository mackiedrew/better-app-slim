/* @flow */
import React, { Component, Fragment } from "react"
import { compose } from "recompose"
import { connect } from "react-redux"
import { withFirebase, firestoreConnect } from "react-redux-firebase"

import { reduxForm } from "redux-form"

import type { FirebaseType } from "../types/FirebaseType"

import withLoggedIn from "../containers/withLoggedIn"
import FitbitActions from "../organisms/FitbitActions"

import { camelToTitle } from "../helpers/text"

import Input from "../molecules/form/Input"
import Form from "../molecules/Form"
import SubmitButton from "../molecules/form/SubmitButton"
import Section from "../templates/Section"
import SimpleTable from "../molecules/SimpleTable"

const ProfileForm = reduxForm({
  form: "profile",
})(({ handleSubmit }: { handleSubmit: Function }) => (
  <Form title="Profile" onSubmit={handleSubmit}>
    <Input label="First Name" name="firstName" component="input" type="text" />
    <Input label="Last Name" name="lastName" component="input" type="text" />
    <Input label="Email" name="email" component="input" type="email" />
    <SubmitButton>Save</SubmitButton>
  </Form>
))

type Props = {
  firebase: FirebaseType,
  firestore: any,
  uid: string,
}

type State = {
  idealMasses: {},
}

class Profile extends Component<Props, State> {
  state = { idealMasses: {} }
  async componentDidMount() {
    const { uid, firestore } = this.props
    const userDoc = await firestore
      .collection("users")
      .doc(uid)
      .get()
    const user = await userDoc.data()
    this.setState({ idealMasses: user.idealMasses })
  }
  render() {
    const { idealMasses } = this.state
    return (
      <Fragment>
        <ProfileForm onSubmit={(values: Object) => console.log(values)} />
        <FitbitActions />
        <Section title={"Ideal Mass"}>
          <SimpleTable
            headingLabels={{ version: "Version", mass: "Mass (kg)" }}
            rows={Object.keys(idealMasses).reduce(
              (acc, key) => [...acc, { version: camelToTitle(key), mass: idealMasses[key] }],
              [],
            )}
          />
        </Section>
      </Fragment>
    )
  }
}

export default compose(
  withFirebase,
  firestoreConnect(),
  connect(state => ({ uid: state.firebase.auth.uid })),
  withLoggedIn({ showLogin: true }),
)(Profile)
