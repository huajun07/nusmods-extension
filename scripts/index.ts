import { augmentTimetable } from './configui'
import { loadTimeTable } from './loadTimetable'
import { filterModule } from './utils/modules'

console.log('abciwadsadatest')
loadTimeTable('https://nusmods.com/timetable/sem-2/share?CS2040S=TUT:14,REC:04,LEC:1&CS2100=LEC:1,LAB:11,TUT:14&CS2107=LEC:1,TUT:05&CS3233=LEC:1&DTK1234=TUT:O25&GEA1000=TUT:E03&HSI2013=LEC:1,TUT:1&IS1108=TUT:06,LEC:1&MA2202S=LEC:1,TUT:1&SP1541=SEC:13')
console.log(filterModule('GEA1000', 2))
augmentTimetable()
