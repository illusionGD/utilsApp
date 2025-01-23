import { NavLink, useNavigate } from 'react-router'

type Props = {}

function Index({}: Props) {
  const nav = useNavigate()
  function gotoImg() {
    nav('/PressImage')
  }

  return <div></div>
}

export default Index
