import React, { useEffect, useState } from 'react';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data.js';
import moment from 'moment';

const Feed = ({ category }) => {
    const [data, setData] = useState([]);
    const [channelData, setChannelData] = useState({});

    const fetchData = async () => {
        try {
            const categoryId = category || '0';

            const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=70&regionCode=IN&videoCategoryId=${categoryId}&key=${API_KEY}`;

            const response = await fetch(videoList_url);
            if (!response.ok) throw new Error(`Failed to fetch videos: ${response.status}`);
            const result = await response.json();

            if (!result.items) throw new Error('No videos found.');
            setData(result.items);

            const channelIds = [...new Set(result.items.map((item) => item.snippet.channelId))];
            await fetchChannelData(channelIds);
        } catch (err) {
            console.error(err);
        }
    };


    const fetchChannelData = async (channelIds) => {
        try {
            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${channelIds.join(',')}&key=${API_KEY}`;
            const response = await fetch(channelData_url);
            if (!response.ok) throw new Error(`Failed to fetch channel data: ${response.status}`);
            const result = await response.json();

            const channelMap = {};
            result.items.forEach((channel) => {
                channelMap[channel.id] = {
                    thumbnail: channel.snippet.thumbnails.default.url,
                    subscribers: value_converter(channel.statistics.subscriberCount),
                };
            });
            setChannelData(channelMap);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    return (
        <div className="feed">
            {data.map((item) => (
                <Link
                    to={`video/${item.snippet.categoryId || ''}/${item.id}`}
                    key={item.id}
                    className="card"
                >
                    <img
                        src={item.snippet.thumbnails?.medium?.url || 'fallback-thumbnail.png'}
                        alt={item.snippet.title || 'Video Thumbnail'}
                    />
                    <div className="card-info">
                        <img
                            src={
                                channelData[item.snippet.channelId]?.thumbnail || 'fallback-channel.png'
                            }
                            alt={item.snippet.channelTitle || 'Channel Thumbnail'}
                            className="channel-thumbnail"
                        />
                        <div>
                            <h2>{item.snippet.title || 'Untitled Video'}</h2>
                            <h3>{item.snippet.channelTitle || 'Unknown Channel'}</h3>
                            <p>
                                {value_converter(item.statistics?.viewCount || 0)} &bull;{' '}
                                {moment(item.snippet.publishedAt).fromNow() || 'Unknown Time'}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Feed;
