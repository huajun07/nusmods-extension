import React, { useState } from 'react'
import { Box, Center, Flex, Spacer, Spinner } from '@chakra-ui/react'
import { ClassSlot, giveSchedule } from '../schedule'
import { resizeIFrameToFitContent } from '../utils/iframe'
import { generateUrl } from '../utils/url'
import { lessonTypeAbbrevToFull } from '../utils/modules'
import { Pagination } from '@nextui-org/react'

var schedules: ClassSlot[][] = []

export default function App() {
	const [total, setTotal] = useState(-1)
	const [cur, setCur] = useState(0)

	const scheduleMods = async () => {
		schedules = await giveSchedule()
		setTotal(schedules.length)
		if (schedules.length > 0) {
			displayTimetable(1)
		}
	}

	const displayTimetable = (idx: number) => {
		setCur(idx)
		const div = document.getElementById('schedule-results')
		function onLoad(this: GlobalEventHandlers, ev: Event) {
			resizeIFrameToFitContent(ev.target as HTMLIFrameElement)
			const iframes = div?.getElementsByTagName('iframe') || []
			for (let i = 0; i < iframes.length - 1; i++) {
				iframes[i].remove()
			}
		}

		const iframe = document.createElement('iframe')
		iframe.style.display = 'none'
		iframe.onload = onLoad
		console.log(generateUrl(schedules[idx - 1]))
		iframe.src = generateUrl(schedules[idx - 1])
		div?.appendChild(iframe)
	}

	const syncMods = async () => {
		const schedule = schedules[cur - 1]
		let modules = {}
		for (const lesson of schedule) {
			const { moduleCode, lessonType, classNo } = lesson
			if (!(moduleCode in modules)) modules[moduleCode] = {}
			modules[moduleCode][lessonTypeAbbrevToFull(lessonType)] = classNo
		}
		window.postMessage(JSON.stringify({ message: 'syncTimetable', modules }))
	}
	return (
		<Flex flexDirection="column">
			<Flex padding="10" width="100%">
				<Box>
					<button className="btn-outline-success btn btn-svg" onClick={() => scheduleMods()}>
						Optimise Timetable
					</button>
				</Box>
				<Spacer />
				<Center>{total != -1 ? `${total} Optimal Schedules were found` : ''}</Center>
				<Spacer />
				<Box>
					{total > 0 ? (
						<button className="btn-outline-primary btn btn-svg" onClick={() => syncMods()}>
							Sync With Timetable
						</button>
					) : null}
				</Box>
			</Flex>
			<Center>
				{total > 0 ? (
					<Pagination
						initialPage={1}
						total={total}
						siblings={3}
						onChange={displayTimetable}
						page={cur}
					/>
				) : null}
			</Center>
		</Flex>
	)
}
