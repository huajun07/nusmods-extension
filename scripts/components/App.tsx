import React, { useState } from 'react'
import { Box, Center, Flex, Spacer } from '@chakra-ui/react'
import { giveSchedule } from '../schedule'
import { resize } from '../utils/iframe'
import { generateUrl } from '../utils/url'
import { lessonTypeAbbrevToFull, setCurrentSemModules } from '../utils/modules'

export default function App() {
	const [message, setMessage] = useState('')

	const scheduleMods = async () => {
		const schedules = await giveSchedule()
		console.log(schedules)
		setMessage(`${schedules.length} Optimal Schedules were found`)
		const div = document.getElementById('schedule-results')
		const iframes = div?.getElementsByTagName('iframe') || []
		for (const iframe of iframes) {
			iframe.remove()
		}
		const iframe = document.createElement('iframe')
		iframe.onload = resize
		console.log(generateUrl(schedules[0]))
		iframe.src = generateUrl(schedules[0])
		div?.appendChild(iframe)
	}
	const syncMods = async () => {
		const schedules = await giveSchedule()
		const schedule = schedules[0]
		let modules = {}
		for (const lesson of schedule) {
			const { moduleCode, lessonType, classNo } = lesson
			if (!(moduleCode in modules)) modules[moduleCode] = {}
			modules[moduleCode][lessonTypeAbbrevToFull(lessonType)] = classNo
		}
		window.postMessage(JSON.stringify({ message: 'syncTimetable', modules }))
	}
	return (
		<Flex padding="10" width="100%">
			<Box>
				<button className="btn-outline-success btn btn-svg" onClick={() => scheduleMods()}>
					Optimise Timetable
				</button>
			</Box>
			<Spacer />
			<Center>{message}</Center>
			<Spacer />
			<Box>
				{message ? (
					<button className="btn-outline-primary btn btn-svg" onClick={() => syncMods()}>
						Sync With Timetable
					</button>
				) : null}
			</Box>
		</Flex>
	)
}
