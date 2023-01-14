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

type ModuleClasses = {
    moduleCode: string
    classes: Map<string, Map<string, number[]>>
}

export type ModuleLesson = {
    moduleCode: string
    lessonType: string
    timings: Map<string, number[]>
}

export const fetchModule = async (moduleCode: string, semester: number): Promise<TimeData[]> => {
    const result: ModuleData = (await axios.get(`https://api.nusmods.com/v2/2022-2023/modules/${moduleCode}.json`)).data
    return result.semesterData[semester - 1].timetable
}

export const filterModule = async (moduleCode: string, semester: number): Promise<ModuleLesson[]> => {
    const resData: TimeData[] = await fetchModule(moduleCode, semester)
    const timeArr: TimeData[] = []

    const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    const moduleClasses: ModuleClasses = {
        moduleCode: moduleCode,
        classes: new Map<string, Map<string, number[]>>()
    }

    for (const obj of resData) {
        const { classNo, startTime, endTime, weeks, day, lessonType } = obj
        const startT: number = Number.parseInt(startTime) / 100 - 8
        const endT: number = Number.parseInt(endTime) / 100 - 8
        let dayNum: number = -1
        
        for (let i = 0; i < 5; i++) {
            if (day === days[i]) {
                dayNum = i
            }
        }

        for (const i of weeks) {
            for (let j = startT; j < endT; j++) {
                const norm: number = j + dayNum * 5 + i * 35;
                if (!moduleClasses.classes.has(lessonType)) {
                    moduleClasses.classes.set(lessonType, new Map<string, number[]>())
                }
                if (!moduleClasses.classes.get(lessonType)?.has(classNo)) {
                    moduleClasses.classes.get(lessonType)?.set(classNo, [])
                }
                moduleClasses.classes.get(lessonType)?.get(classNo)?.push(norm)
            }
        }
    }

    for (const [_, timings] of moduleClasses.classes) {
        const classTimes: Map<string, boolean> = new Map<string, boolean>()
        const toErase: string[] = []
        for (const [classNo, timeArr] of timings) {
            timeArr.sort()
            const str = JSON.stringify(timeArr)
            if (classTimes.has(str)) {
                toErase.push(classNo)
                continue
            }
            classTimes.set(str, true)
        }
        for (const classNo of toErase) {
            timings.delete(classNo)
        }
    }

    const moduleLessons: ModuleLesson[] = []
    
    for (const [lessonType, timings] of moduleClasses.classes) {
        const moduleLesson: ModuleLesson = {
            moduleCode: moduleCode,
            lessonType: lessonType,
            timings: timings
        }
        moduleLessons.push(moduleLesson)
    }

    return moduleLessons
}
