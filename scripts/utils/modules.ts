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
	const result: ModuleData = (
		await axios.get(`https://api.nusmods.com/v2/2022-2023/modules/${moduleCode}.json`)
	).data
	for (const semData of result.semesterData) {
		if (semData.semester == semester) {
			return semData.timetable
		}
	}
	return []
}

export const filterModule = async (
	moduleCode: string,
	semester: number
): Promise<ModuleLesson[]> => {
	const resData: TimeData[] = await fetchModule(moduleCode, semester)
	const timeArr: TimeData[] = []

	const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

	const moduleClasses: ModuleClasses = {
		moduleCode: moduleCode,
		classes: new Map<string, Map<string, number[]>>(),
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
				const norm: number = j + dayNum * 14 + (i - 1) * 70
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
			timings: timings,
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
type LessonAbbrev = (typeof LESSON_TYPE_ABBREV)[keyof typeof LESSON_TYPE_ABBREV]
export function lessonTypeAbbrevToFull(abbrv: LessonAbbrev) {
	for (const full in LESSON_TYPE_ABBREV) {
		if (LESSON_TYPE_ABBREV[full] === abbrv) return full
	}
	return ''
}

type Modules = {
	[name: string]: Partial<Record<LessonType, string>>
}

export type ModuleConfig = {
	[name: string]: Partial<
		Record<
			LessonType,
			{
				config: LessonConfig
				classNo: string
			}
		>
	>
}

type StorageModuleConfig = {
	[name: string]: Partial<
		Record<
			LessonType,
			{
				config: LessonConfig
				classNo: string
			}
		>
	>
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

export function getCurrentSemModules(): Modules {
	const currentTimetable = JSON.parse(localStorage.getItem('persist:timetables') as string)
	const currentClasses = JSON.parse(currentTimetable.lessons as string)[getCurrentSem()]
	return currentClasses
}

export function setCurrentSemModules(value: Modules) {
	let currentTimetable = JSON.parse(localStorage.getItem('persist:timetables') ?? '{}')
	let currentClasses = JSON.parse(currentTimetable.lessons as string)
	currentClasses[getCurrentSem()] = value
	currentTimetable.lessons = JSON.stringify(currentClasses)
	localStorage.setItem('persist:timetables', JSON.stringify(currentTimetable))
}

export function getCurrentSemConfig(): StorageModuleConfig {
	const moduleConfig = JSON.parse(localStorage.getItem('persist:moduleConfigs') ?? '{}')[
		getCurrentSem()
	] as StorageModuleConfig
	return moduleConfig ?? {}
}

export function getCurrentSemConfigForScheduling(): ModuleConfig {
	const moduleConfig = JSON.parse(localStorage.getItem('persist:moduleConfigs') ?? '{}')[
		getCurrentSem()
	] as StorageModuleConfig
	let legitModuleConfig = {}
	const modules = getCurrentSemModules()
	for (const moduleName in moduleConfig) {
		if (moduleName === 'A') continue
		legitModuleConfig[moduleName] = {}
		for (const lessonType in moduleConfig[moduleName]) {
			legitModuleConfig[moduleName][lessonType] = {
				config: moduleConfig[moduleName][lessonType],
				classNo: modules[moduleName][lessonType],
			}
		}
	}
	return legitModuleConfig
}

export function setCurrentSemConfig(value: StorageModuleConfig) {
	let config = JSON.parse(localStorage.getItem('persist:moduleConfigs') ?? '{}')
	config[getCurrentSem()] = value
	localStorage.setItem('persist:moduleConfigs', JSON.stringify(config))
}

export function addFillerModuleToList() {
	type ModuleList = {
		moduleCode: string
		title: string
		semesters: number[]
	}[]
	type Modules = {
		[name: string]: any
	}
	let moduleBank = JSON.parse(localStorage.getItem('persist:moduleBank') as string)
	let moduleList = JSON.parse(moduleBank.moduleList) as ModuleList
	let modules = JSON.parse(moduleBank.modules) as Modules
	if (moduleList[0].moduleCode === 'A') return

	moduleList.unshift({ moduleCode: 'A', title: 'Filler', semesters: [1, 2, 3, 4] })
	modules['A'] = {
		acadYear: '2022/2023',
		preclusion: '',
		description: '',
		title: 'Filler',
		department: '',
		faculty: '',
		workload: [],
		prerequisite: '',
		moduleCredit: '',
		moduleCode: 'A',
		attributes: {
			mpes1: true,
			mpes2: true,
		},
		semesterData: [
			{
				semester: 1,
				timetable: [
					{
						classNo: '1',
						startTime: '0800',
						endTime: '2200',
						weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
						day: 'Monday',
					},
				],
			},
			{
				semester: 2,
				timetable: [
					{
						classNo: '1',
						startTime: '0800',
						endTime: '2200',
						weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
						day: 'Monday',
					},
				],
			},
		],
	}

	localStorage.setItem(
		'persist:moduleBank',
		JSON.stringify({ moduleList: JSON.stringify(moduleList), modules: JSON.stringify(modules) })
	)
}

export function addFillerModuleToTimetable() {
	let modules = getCurrentSemModules()
	if ('A' in modules) return
	modules['A'] = { Tutorial: '1' }
	setCurrentSemModules(modules)
}
