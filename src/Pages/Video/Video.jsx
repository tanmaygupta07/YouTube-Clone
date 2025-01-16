import React from 'react';
import './video.css';
import PlayVideo from '../../Components/PlayVideo/PlayVideo';
import Recommended from '../../Components/Recommended/Recommended';
import { useParams } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';

const Video = ({ sidebar, setSidebar, category, setCategory }) => {
    const { videoId, categoryId } = useParams();

    return (
        <div className="video-content">
            {sidebar && <Sidebar sidebar={sidebar} category={category} setCategory={setCategory} />}
            <div className="play-container">
                <PlayVideo videoId={videoId} />
                <Recommended categoryId={categoryId} />
            </div>
        </div>
    );
};

export default Video;