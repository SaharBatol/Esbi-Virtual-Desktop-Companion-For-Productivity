import LoggedIn from './LoggedIn'
import SignUp from './SignUp'

const LandingPage = ({ userNameFromLocalStorage, setUserNameFromLocalStorage }) => {
  if (userNameFromLocalStorage) {
    return <LoggedIn userNameFromLocalStorage={userNameFromLocalStorage} />
  }
  return <SignUp setUserNameFromLocalStorage={setUserNameFromLocalStorage} />
}

export default LandingPage
