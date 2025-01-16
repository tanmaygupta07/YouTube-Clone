import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Video from './Pages/Video/Video';

const App = () => {
	const location = useLocation();
	const isVideoPage = location.pathname.startsWith('/video');
	const [sidebar, setSidebar] = useState(!isVideoPage);
	const [category, setCategory] = useState(0);

	return (
		<div>
			<Navbar setSidebar={setSidebar} />
			<Routes>
				<Route path="/" element={<Home sidebar={sidebar} category={category} setCategory={setCategory} />} />
				<Route path="/video/:categoryId/:videoId" element={<Video sidebar={sidebar} setSidebar={setSidebar} category={category} setCategory={setCategory} />} />
			</Routes>
		</div>
	);
};

export default App;