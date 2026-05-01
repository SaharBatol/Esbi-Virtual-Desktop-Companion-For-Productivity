const NewStudySessionInput = ({
  labelName,
  inputType = 'number',
  placeholder,
  newSessionSettings,
  setNewSessionSettings,
  inputValue
}) => {
  return (
    <>
      <label className="config-label">{labelName}</label>
      <input
        className="input-field mb-lg"
        type={inputType}
        placeholder={placeholder}
        value={newSessionSettings[inputValue]}
        onChange={(e) =>
          setNewSessionSettings((settings) => ({
            ...settings,
            [inputValue]: e.target.value
          }))
        }
      />
    </>
  )
}

export default NewStudySessionInput
