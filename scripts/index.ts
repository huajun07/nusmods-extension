import { initalizeDashboard } from './configDashboard'
import { augmentTimetable } from './configui'
import { loadScheduler } from './loadScheduler'
import { giveSchedule } from './schedule'
import { filterModule } from './utils/modules'

console.log('abciwadsadatest')
loadScheduler()
console.log(filterModule('GEA1000', 2))
augmentTimetable()
const func = async() =>{
    console.log((await giveSchedule()))
}
func()

initalizeDashboard()
