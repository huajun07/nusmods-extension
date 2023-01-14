import hiddenIcon from './assets/hidden_icon.png'
import fixedIcon from './assets/fixed_icon.png'
import normalIcon from './assets/normal_icon.png'
import './index.css'
import {
	LessonConfig,
	addFillerModuleToList,
	addFillerModuleToTimetable,
	getCurrentSemConfig,
	getCurrentSemConfigForScheduling,
	getCurrentSemModules,
	setCurrentSemConfig,
} from './utils/modules'

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

function abbrToFullLessonType(typ: string) {
	for (const key in LESSON_TYPE_ABBREV) {
		if (LESSON_TYPE_ABBREV[key] === typ) return key
	}
	return ''
}

function updateClassConfig(name: string, typ: string, newValue: LessonConfig) {
	let config = getCurrentSemConfig()
	if (!(name in config)) return
	config[name][typ] = newValue
	setCurrentSemConfig(config)
}

export function augmentTimetable() {
	// addFillerModuleToList()
	// addFillerModuleToTimetable()
	// getCurrentSemConfigForScheduling()
	const currentModules = getCurrentSemModules()
	let oldConfig = getCurrentSemConfig()
	let config = {}
	for (const moduleName in currentModules) {
		if (!(moduleName in oldConfig)) {
			config[moduleName] = {}
			for (const cls in currentModules[moduleName]) config[moduleName][cls] = LessonConfig.Normal
		} else {
			config[moduleName] = oldConfig[moduleName]
		}
	}
	setCurrentSemConfig(config)

	// add toggle buttons to all the modules
	const cells = document.getElementsByClassName('timetable-cell')
	const getClassDetails = (cell) => {
		const re = new RegExp('^[a-zA-Z0-9]+-[A-Z]+-[a-zA-Z0-9]+$')
		for (const s of cell.classList) {
			if (re.test(s)) {
				const data = s.split('-')
				return { name: data[0], lessonType: abbrToFullLessonType(data[1]), classNo: data[2] }
			}
		}
		return { name: 'error', lessonType: 'error', classNo: 'error' }
	}
	for (const cell of cells) {
		const modules = getCurrentSemModules()
		const { name, lessonType, classNo } = getClassDetails(cell)
		if (modules[name][lessonType] !== classNo) {
			if (cell.children.length >= 2 && cell.children[1].tagName === 'BUTTON') {
				cell.removeChild(cell.children[1])
			}
			continue
		}

		let button: HTMLButtonElement
		if (cell.children.length >= 2 && cell.children[1].tagName === 'BUTTON') {
			button = cell.children[1] as HTMLButtonElement
		} else {
			button = document.createElement('button')
			cell.appendChild(button)
		}
		button.className = 'toggle-button'

		const icon = {
			[LessonConfig.Normal]: normalIcon,
			[LessonConfig.Fixed]: fixedIcon,
			[LessonConfig.Hidden]: hiddenIcon,
		}[config[name][lessonType]]
		if (button.children.length === 0) {
			const iconImg = document.createElement('img')
			iconImg.src = icon
			button.appendChild(iconImg)
		} else {
			;(button.children[0] as HTMLImageElement).src = icon
		}

		if (config[name][lessonType] === LessonConfig.Hidden) {
			;(cell as HTMLDivElement).style.opacity = '0.5'
		} else {
			;(cell as HTMLDivElement).style.opacity = '1'
		}

		button.onclick = (evt) => {
			if (config[name][lessonType] === LessonConfig.Normal)
				updateClassConfig(name, lessonType, LessonConfig.Fixed)
			if (config[name][lessonType] === LessonConfig.Fixed)
				updateClassConfig(name, lessonType, LessonConfig.Hidden)
			if (config[name][lessonType] === LessonConfig.Hidden)
				updateClassConfig(name, lessonType, LessonConfig.Normal)
			evt.preventDefault()
			evt.stopPropagation() // prevent parent button from being clicked
		}
	}
	// add free blocks
}

setInterval(() => augmentTimetable(), 200)
