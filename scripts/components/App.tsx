import React, { useState } from 'react'
import { Box, Center, Flex, Spacer } from '@chakra-ui/react'
import { giveSchedule } from '../schedule'
import { resize } from '../utils/iframe'
import { generateUrl } from '../utils/url'

export default function App() {
	const [message, setMessage] = useState('')

	const scheduleMods = async () => {
		const schedules = await giveSchedule()
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
					<button className="btn-outline-primary btn btn-svg" onClick={() => scheduleMods()}>
						Sync With Timetable
					</button>
				) : null}
			</Box>
		</Flex>
	)
}
