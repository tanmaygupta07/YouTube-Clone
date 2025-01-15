import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import download from '../../assets/download.png';
import save from '../../assets/save.png';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {

    const { videoId } = useParams();

    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const fetchVideoData = async () => {
        //Fetching videos data
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
        await fetch(videoDetails_url)
            .then(res => res.json())
            .then(data => setApiData(data.items[0]));
    }

    const fetchOtherData = async () => {
        //fetching channel data
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
        await fetch(channelData_url)
            .then(res => res.json())
            .then(data => setChannelData(data.items[0]));

        //fetching comments data
        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
        await fetch(comment_url)
            .then(res => res.json())
            .then(data => setCommentData(data.items));
    }

    useEffect(() => {
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        fetchOtherData();
    }, [apiData]);

    const toggleDescription = () => {
        setIsDescriptionExpanded((prev) => !prev);
    };

    const makeLinksClickable = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            const href = url.startsWith("http") ? url : `https://${url}`;
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:rgb(6,95,212); text-decoration:none;">${url}</a>`;
        });
    };

    const getDisplayDescription = () => {
        if (!apiData) return 'Description Here';

        const rawDescription = apiData.snippet.description;

        const clickableDescription = makeLinksClickable(rawDescription);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = clickableDescription;

        const plainText = tempDiv.textContent || tempDiv.innerText;

        if (isDescriptionExpanded || plainText.length <= 35) {
            return clickableDescription.replace(/\n/g, '<br>');
        } else {
            const truncatedText = plainText.slice(0, 35);

            const truncatedDiv = document.createElement('div');
            truncatedDiv.textContent = truncatedText;

            const truncatedWithBreaks = truncatedDiv.innerHTML.replace(/\n/g, '<br>');

            return makeLinksClickable(truncatedWithBreaks);
        }
    };

    return (
        <div className="play-video">
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title Error"}</h3>
            <div className="play-video-info">
                <div className="publisher">
                    <img src={channelData ? channelData.snippet.thumbnails.default.url : ''} alt="" />
                    <div>
                        <p>{apiData ? apiData.snippet.channelTitle : ''}</p>
                        <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : ''} Subscribers</span>
                    </div>
                    <button>Subscribe</button>
                </div>
                <div className='action-buttons'>
                    <span><img src={like} alt="" /><p>{apiData ? value_converter(apiData.statistics.likeCount) : 155}</p></span>
                    <span><img src={dislike} alt="" /></span>
                    <span><img src={download} alt="" />Download</span>
                    <span><img src={save} alt="" />Save</span>
                </div>
            </div>

            <div className="vid-description">
                <div className="vid-des-details">
                    <p className='views-time'>{apiData ? apiData.statistics.viewCount + ' views' : "View count error"} &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
                    <p
                        className="description"
                        dangerouslySetInnerHTML={{
                            __html: getDisplayDescription(),
                        }}
                    ></p>
                    {apiData && apiData.snippet.description.split(' ').length > 35 && (
                        <p className="read-more-btn" onClick={toggleDescription}>
                            {isDescriptionExpanded ? 'Show Less' : '...more'}
                        </p>
                    )}
                </div>
                <h4 className='total-comments'>{apiData ? apiData.statistics.commentCount : 102} Comments</h4>

                {commentData.map((item, index) => {
                    return (
                        <div key={index} className="comment">
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                                <p className='comment-text'>{item.snippet.topLevelComment.snippet.textOriginal} </p>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt="" />
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default PlayVideo