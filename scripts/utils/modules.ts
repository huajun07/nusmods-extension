import axios from 'axios'

type ModuleData = {
    semesterData: SemData[]
}

type SemData = {
	semester: number
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
	for (const semData of result.semesterData) {
		if (semData.semester == semester) {
			return semData.timetable
		}
	}
	return []
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
                const norm: number = j + dayNum * 14  + (i - 1) * 70;
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

export const LESSON_TYPE_ABBREV = {
	'Design Lecture': 'DLEC',
	Laboratory: 'LAB',
	Lecture: 'LEC',
	'Packaged Lecture': 'PLEC',
	'Packaged Tutorial': 'PTUT',
	Recitation: 'REC',
	'Sectional Teaching': 'SEC',
	'Seminar-Style Module Class': 'SEM',
	Tutorial: 'TUT',
	'Tutorial Type 2': 'TUT2',
	'Tutorial Type 3': 'TUT3',
	Workshop: 'WS',
}
type LessonType = keyof typeof LESSON_TYPE_ABBREV

export type ModuleConfig = {
	[name: string]: {
		[key in LessonType]: {
			config: LessonConfig
			classNo: string
		}
	}
}

export enum LessonConfig {
	Normal,
	Hidden,
	Fixed,
}

export function getCurrentSem(): number {
	const currentSemName = window.location.pathname.split('/').pop() as string
	return {
		'sem-1': 1,
		'sem-2': 2,
		'st-i': 3,
		'st-ii': 4,
	}[currentSemName] as number
}

export function getCurrentSemModules(): {
	[name: string]: {
		[key in LessonType]: string
	}
} {
	const currentTimetable = JSON.parse(localStorage.getItem('persist:timetables') as string)
	const currentClasses = JSON.parse(currentTimetable.lessons as string)[getCurrentSem()]
	return currentClasses
}

export function getCurrentSemConfig(): ModuleConfig {
	const moduleConfig = JSON.parse(localStorage.getItem('persist:moduleConfigs') ?? '{}')[
		getCurrentSem()
	] as ModuleConfig
	return moduleConfig ?? {}
}

export function setCurrentSemConfig(value: ModuleConfig) {
	let config = JSON.parse(localStorage.getItem('persist:moduleConfigs') ?? '{}')
	config[getCurrentSem()] = value
	localStorage.setItem('persist:moduleConfigs', JSON.stringify(config))
}
