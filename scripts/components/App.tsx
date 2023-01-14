import React, { useState } from 'react'

export default function App() {
	const [count, setCount] = useState(1)
	return (
		<div>
			<button onClick={() => setCount(count + 1)}>test</button>
			<p>{count}</p>
		</div>
	)
}
