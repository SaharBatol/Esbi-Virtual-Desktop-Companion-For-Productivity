import idleAnimation from '../../assets/idleAnimation.gif?url'
import cheerAnimation from '../../assets/cheerAnimation.gif?url'
import waveAnimation from '../../assets/waveAnimation.gif?url'
import breakAnimation from '../../assets/breakAnimation.gif?url'

const AvatarAnimations = ({ animationState, isAvatarVisible }) => {
  const animations = {
    idle: idleAnimation,
    wave: waveAnimation,
    cheer: cheerAnimation,
    break: breakAnimation
  }

  return (
    <>
      <img
        src={animations[animationState]}
        alt="animation"
        className={`animation-image-open ${isAvatarVisible ? 'fade-in' : 'fade-out'}`}
      />
    </>
  )
}

export default AvatarAnimations
