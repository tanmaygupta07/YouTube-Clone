import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Video from './Pages/Video/Video';

const App = () => {
	const location = useLocation();
	const [sidebar, setSidebar] = useState(true);

	useEffect(() => {
		const isVideoPage = location.pathname.startsWith('/video');
		setSidebar(!isVideoPage);
	}, [location.pathname]);

	return (
		<div>
			<Navbar setSidebar={setSidebar} />
			<Routes>
				<Route path="/" element={<Home sidebar={sidebar} />} />
				<Route
					path="/video/:categoryId/:videoId"
					element={<Video sidebar={sidebar} setSidebar={setSidebar} />}
				/>
			</Routes>
		</div>
	);
};

export default App;
