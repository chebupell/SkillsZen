import logo from '../../public/fav.png'
import CreateButton from './buttons/createButton'

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />

        <h2 className="text-xl font-semibold text-gray-800">SkillsZen</h2>
      </div>

      <CreateButton
        text="Log Out"
        className="px-4 py-2 rounded-lg border hover:bg-gray-100"
        onClick={() => console.log('Клац')}
      />
    </header>
  )
}

export default Header
