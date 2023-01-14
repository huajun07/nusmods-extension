import React, { useState } from 'react'
import { Box, Center, Flex, Spacer } from '@chakra-ui/react'
import { giveSchedule } from '../schedule'

export default function App() {
	const [message, setMessage] = useState('')

	const scheduleMods = async () => {
		const schedules = await giveSchedule()
		console.log(schedules[0])
		const schedules1 = [1, 2, 3, 4]
		setMessage(`${schedules1.length} Optimal Schedules were found`)
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
