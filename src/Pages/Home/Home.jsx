import React from 'react';
import './Home.css';
import Sidebar from '../../Components/Sidebar/Sidebar.jsx';

const Home = ({ sidebar }) => {
	return (
		<>
			<Sidebar sidebar={sidebar} />
		</>
	)
}

export default Home