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
	const result: ModuleData = (
		await axios.get(`https://api.nusmods.com/v2/2022-2023/modules/${moduleCode}.json`)
	).data
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

const LESSON_TYPE_ABBREV = {
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

type ModuleConfig = {
	[name: string]: {
		[key in LessonType]: {
			config: LessonConfig
			classNo: string
		}
	}
}

enum LessonConfig {
	Normal,
	Hidden,
	Fixed,
}

function getCurrentSemModules() {
	const currentSemName = window.location.pathname.split('/').pop() as string
	const currentSem = {
		'sem-1': 1,
		'sem-2': 2,
		'st-i': 3,
		'st-ii': 4,
	}[currentSemName] as number

	const currentTimetable = JSON.parse(localStorage.getItem('persist:timetables') as string)
	const currentClasses = JSON.parse(currentTimetable.lessons as string)[currentSem]
	return currentClasses
}

function getCurrentSemConfig(): ModuleConfig {
	const currentSemName = window.location.pathname.split('/').pop() as string
	const currentSem = {
		'sem-1': 1,
		'sem-2': 2,
		'st-i': 3,
		'st-ii': 4,
	}[currentSemName] as number

	const moduleConfig = JSON.parse(localStorage.getItem('persist:moduleConfigs') as string)[
		currentSem
	] as ModuleConfig
	return moduleConfig
}
