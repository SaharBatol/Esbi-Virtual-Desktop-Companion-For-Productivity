import { useState } from 'react'

const SignUp = ({ setUserNameFromLocalStorage }) => {
  const [userNameToAdd, setUserNameToAdd] = useState('')
  const [error, setError] = useState('')

  const addUserNameToLocalStorage = () => {
    setUserNameFromLocalStorage(userNameToAdd)
    localStorage.setItem('username', userNameToAdd)
  }

  const handleChange = (e) => {
    setUserNameToAdd(e.target.value)
    if (error) {
      setError('')
    }
  }

  return (
    <div className="sign-up-container">
      <h1>Enter your username</h1>
      <div className="sign-up-button-container">
        <input
          className="input-field"
          type="text"
          value={userNameToAdd}
          onChange={handleChange}
          placeholder="Username"
        />
        {error && <p className="error">{error}</p>}
        <button className="button-style" onClick={addUserNameToLocalStorage}>
          Confirm
        </button>
      </div>
    </div>
  )
}

export default SignUp
