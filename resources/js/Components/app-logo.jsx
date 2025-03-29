import Logo from '../../../public/images/logo.png'

const AppLogo = ({ className = '' }) => {
  return (
    <img src={Logo} className={`object-contain ${className}`} alt="logo" />
  )
}

export default AppLogo