import axios from 'axios'
import {parse} from 'node-html-parser'

export const generateTimetable = async (url: string): Promise<string> =>{
    const html = (await axios.get(url)).data
    const root = parse(html)
    const timetable = root.querySelector('.timetable')
    return timetable?.toString() || ""
}