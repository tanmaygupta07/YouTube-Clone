import React, { useEffect, useState } from 'react';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data.js';
import moment from 'moment';

const Feed = ({ category }) => {
    const [data, setData] = useState([]);
    const [channelData, setChannelData] = useState({}); // Store channel data by channelId

    const fetchData = async () => {
        const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=70&regionCode=IN&videoCategoryId=${category}&key=${API_KEY}`;
        const response = await fetch(videoList_url);
        const result = await response.json();
        setData(result.items);

        const channelIds = [...new Set(result.items.map((item) => item.snippet.channelId))];
        fetchChannelData(channelIds);
    };

    const fetchChannelData = async (channelIds) => {
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${channelIds.join(',')}&key=${API_KEY}`;
        const response = await fetch(channelData_url);
        const result = await response.json();

        const channelMap = {};
        result.items.forEach((channel) => {
            channelMap[channel.id] = {
                thumbnail: channel.snippet.thumbnails.default.url,
                subscribers: value_converter(channel.statistics.subscriberCount),
            };
        });
        setChannelData(channelMap);
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    return (
        <div className="feed">
            {data.map((item, index) => (
                <Link to={`video/${item.snippet.categoryId}/${item.id}`} key={index} className="card">
                    <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
                    <div className="card-info">
                        <img
                            src={channelData[item.snippet.channelId]?.thumbnail || ''}
                            alt={item.snippet.channelTitle}
                            className="channel-thumbnail"
                        />
                        <div>
                            <h2>{item.snippet.title}</h2>
                            <h3>{item.snippet.channelTitle}</h3>
                            <p>
                                {value_converter(item.statistics.viewCount)} &bull;{' '}
                                {moment(item.snippet.publishedAt).fromNow()}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Feed;
