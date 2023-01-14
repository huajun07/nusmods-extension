import axios from 'axios'

type ModuleData = {
    semesterData: SemData[]
}

type SemData = {
    timetable: TimeData[]
}

type TimeData = {
    classNo: string
    startTime: string
    endTime: string
    weeks: number[]
    venue: string
    day: string
    lessonType: string
}

export const fetchModule = async (moduleCode: string, semester: number): Promise<TimeData[]> => {
    const result: ModuleData = (await axios.get(`https://api.nusmods.com/v2/2022-2023/modules/${moduleCode}.json`)).data
    return result.semesterData[semester - 1].timetable
}

export const filterModule = async (moduleCode: string, semester: number): Promise<TimeData[]> => {
    const resData: TimeData[] = await fetchModule(moduleCode, semester)
    const objData = new Map<string, boolean>()
    const timeArr: TimeData[] = []
    for (const obj of resData) {
        const { startTime, endTime, weeks, day, lessonType } = obj
        const str = JSON.stringify({ startTime, endTime, weeks, day, lessonType })
        if (objData.has(str)) {
            continue
        }
        objData.set(str, true)
        timeArr.push(obj)
    }
    return timeArr
}
