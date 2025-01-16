import React, { useState } from 'react';
import './Home.css';
import Sidebar from '../../Components/Sidebar/Sidebar.jsx';
import Feed from '../../Components/Feed/Feed.jsx';

const Home = ({ sidebar, category, setCategory }) => {
	return (
		<>
			<Sidebar sidebar={sidebar} category={category} setCategory={setCategory} />
			<div className={`container ${sidebar ? '' : 'large-container'}`}>
				<Feed category={category} />
			</div>
		</>
	);
};

export default Home;
