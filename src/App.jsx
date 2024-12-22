import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/home'
import Video from './Pages/Video/Video'

const App = () => {

	const [sidebar, setSidebar] = useState(true);

	return (
		<div>
			<Navbar setSidebar={setSidebar} />
			<Routes>
				<Route path="/" element={<Home sidebar={sidebar} />} />
				<Route path="/video/:categoryID/:videoID" element={<Video />} />
			</Routes>
		</div>
	)
}

export default App