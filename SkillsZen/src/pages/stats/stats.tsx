import Header from './components/header'
import ProcessBar from './components/processBar'
import RewardsBar from './components/rewardsBar'
import Title from './components/title'

function StatsPage() {
  return (
    <div className="content">
      <Header />
      <Title />
      <ProcessBar />
      <RewardsBar />
    </div>
  )
}

export default StatsPage
