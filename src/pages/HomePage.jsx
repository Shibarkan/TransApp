
import AreaMapCard from '../components/AreaMapCard.jsx'
import CorridorScroller from '../components/CorridorScroller.jsx'
import HomeServiceInfo from '../components/HomeServiceInfo.jsx'
import QuickActions from '../components/QuickActions.jsx'
import WelcomeHeader from '../components/WelcomeHeader.jsx'

function HomePage() {
  return (
    <div>
      <WelcomeHeader />

      <QuickActions />

      <div className="space-y-7 px-5 pb-7 pt-6">
        <CorridorScroller />

        <AreaMapCard />

        <HomeServiceInfo />
      </div>
    </div>
  )
}

export default HomePage
