import { augmentTimetable } from "./configui"
import { initalizeDashboard } from "./dashboard"

export const loadApp = () =>{
    initalizeDashboard()
    augmentTimetable()
}