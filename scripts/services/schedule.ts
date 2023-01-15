import { filterModule, getCurrentSemConfigForScheduling, ModuleLesson } from '../utils/modules'
import {
	getCurrentSem,
	LessonConfig,
	LESSON_TYPE_ABBREV,
	ModuleConfig,
} from '../utils/modules'

var taken: boolean[] = Array(910).fill(false)
var hidden: boolean[] = Array(910).fill(false)
var blocked: boolean[] = Array(910).fill(false)

type ClassSlot = {
	moduleCode: string
	lessonType: string
	classNo: string
}

var moduleConfig: ModuleConfig = getCurrentSemConfigForScheduling()

var classes: ModuleLesson[] = []
var optTime: number[] = [300, 300]
var possibleSchedules: ClassSlot[][] = []
var slots: ClassSlot[] = []

// Call this to get the schedules
export const giveSchedule = async (): Promise<ClassSlot[][]> => {
	moduleConfig = getCurrentSemConfigForScheduling()
	possibleSchedules = []
	optTime = [300, 300]
	classes = []
	slots = []

	const semNum: number = getCurrentSem()
	for (const moduleCode in moduleConfig) {
		const moduleLessons: ModuleLesson[] = await filterModule(moduleCode, semNum)
		for (const lessons of moduleLessons) {
			classes.push(lessons)
		}
	}
	classes.sort((a, b) => a.timings.size - b.timings.size)

	schedule(0)

	return possibleSchedules
}

export const schedule = (idx: number) => {
	const moduleCode: string = classes[idx].moduleCode
	const lessonType: string = classes[idx].lessonType
	const abbrev: string = LESSON_TYPE_ABBREV[lessonType]
	const timings: Map<string, number[]> = classes[idx].timings

	const config: LessonConfig = moduleConfig[moduleCode][lessonType].config

	if (config === LessonConfig.Fixed) {
		const classNo: string = moduleConfig[moduleCode][lessonType].classNo
		const times = timings.get(classNo) || []
		insertClass(idx, moduleCode, abbrev, classNo, times, false)
	} else if (config === LessonConfig.Normal) {
		for (const [classNo, times] of timings) {
			insertClass(idx, moduleCode, abbrev, classNo, times, false)
		}
	} else {
		for (const [classNo, times] of timings) {
			insertClass(idx, moduleCode, abbrev, classNo, times, true)
		}
	}
}

export function computeTime(): number[] {
	let dayCount: number = 0
	let totalTime: number = 0
	for (let i = 0; i < 65; i++) {
		let earliest: number = 30
		let latest: number = -1
		for (let j = 0; j < 14; j++) {
			const time: number = j + i * 14
			if (taken[time]) {
				latest = j
				if (earliest === 30) {
					earliest = j
				}
			}
		}
		if (latest != -1) {
			dayCount += 1
			totalTime += latest - earliest + 1
		}
	}

	const ans: number[] = [dayCount, totalTime]
	return ans
}

export function insertClass(
	idx: number,
	moduleCode: string,
	lessonType: string,
	classNo: string,
	times: number[],
	isHidden: boolean
): void {
	let noClash: boolean = true
	for (const time of times) {
		if (!isHidden) {
			if (taken[time] || blocked[time] || hidden[time]) {
				noClash = false
				break
			}
		} else {
			if (taken[time] || hidden[time]) {
				noClash = false
				break
			}
		}
	}
	if (noClash) {
		for (const time of times) {
			if (!isHidden) {
				taken[time] = true
			} else {
				hidden[time] = true
			}
		}
		const newSlot: ClassSlot = {
			moduleCode: moduleCode,
			lessonType: lessonType,
			classNo: classNo,
		}

		slots.push(newSlot)
		if (idx == classes.length - 1) {
			const computedTime: number[] = computeTime()
			const dayCount: number = computedTime[0]
			const totalTime: number = computedTime[1]
			if (dayCount < optTime[0] || (dayCount === optTime[0] && totalTime < optTime[1])) {
				possibleSchedules = []
				possibleSchedules.push([...slots])
				optTime = computedTime
			} else if (dayCount === optTime[0] && totalTime === optTime[1]) {
				possibleSchedules.push([...slots])
			}
		} else {
			const computedTime: number[] = computeTime()
			const dayCount: number = computedTime[0]
			const totalTime: number = computedTime[1]
			if (dayCount < optTime[0] || (dayCount === optTime[0] && totalTime <= optTime[1])) {
				schedule(idx + 1)
			}
		}
		for (const time of times) {
			if (!isHidden) {
				taken[time] = false
			} else {
				hidden[time] = false
			}
		}
		slots.pop()
	}
}

export {ClassSlot}

//# sourceMappingURL=/build/schedule.js.map
