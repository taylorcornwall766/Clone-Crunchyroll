import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postEpisodeThunk } from "../../store/animeDetail"
import { useHistory } from 'react-router-dom'
import { useParams } from "react-router-dom";
import { getAllAnimeThunk } from '../../store/anime';


const EpisodeForm = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [episodeNum, setEpisodeNum] = useState('')
    const [description, setDescription] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [videoLink, setVideoLink] = useState(undefined)
    const [title, setTitle] = useState('')
    const [coverPicture, setCoverPicture] = useState('')
    const [errors, setErrors] = useState([])
    const { animeId } = useParams();

    const userId = useSelector(state => state.session.user)
    const allAnime = useSelector(state => state.anime)
    // const anime = allAnime.animeId
    useEffect(() => {
        dispatch(getAllAnimeThunk())
    }, [dispatch])

    const anime = allAnime[animeId]
    if (!anime) {
        return (
            <h3> Loading... </h3>
        )
    }

    // console.log('user id --->>>>', userId)
    // // console.log('anime ---->>>>', animeId)
    // console.log('anime from state', anime)
    // // if anime.authorId == userId.id
    // if(!userId) {
    //     history.push('/anime')
    // }
    if (userId === null || userId.id !== anime.authorId) {
        // alert('You are not authorized to post an episode for this anime')
        history.push('/anime')
    }







    const resetFile = (e) => {
        console.log("this isisi siis is hit")
        console.log("e.target -> ", e.target)
        // console.log("e.target -> ",e.tar)
        // e.target.files[0] = null
        e.preventDefault()
        setVideoLink(undefined)
    }
    const formValidate = () => {
        const newFormErrors = {}
        if (!episodeNum) {
            newFormErrors.episodeNum = "Your episode MUST have a episode number."
        }
        if (!description || description.length > 1000) {
            newFormErrors.description = "Your episode MUST have a description and it must be less than 1000 characters long."
        }
        if (!releaseDate) {
            newFormErrors.releaseDate = "Your episode MUST have a release date specified."
        }
        if (!videoLink) {
            newFormErrors.videoLink = "Your show MUST have a video link to the episode."
        }
        if (!title || title.length > 100) {
            newFormErrors.title = "Your episode MUST have a title and it must be less than 100 characters"
        }
        if (!coverPicture) {
            newFormErrors.coverPicture = "Your episode MUST have a cover image"
        }
        if (Object.values(newFormErrors).length > 0) {
            setErrors(newFormErrors)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log("coverpic : ", Object.keys(videoLink))
        formValidate()
        const formData = new FormData()
        formData.append("episode_number", episodeNum)
        formData.append("description", description)
        formData.append("release_date", releaseDate)
        formData.append("video_link", videoLink)
        formData.append("title", title)
        formData.append("episode_cover_picture", coverPicture)

        console.log('EPISODE FORM DATA FROM REACT COMPONENT ->', formData)
        // const newAnime = {
        //     "episodeNum": episodeNum,
        //     "description": description,
        //     "release_date": releaseDate,
        //     "cover_picture": videoLink
        // }

        if (!Object.values(errors).length) {
            console.log("anime:", formData)
            const res = await dispatch(postEpisodeThunk(animeId, formData))
            if (res.id) {
                history.push(`/anime/${animeId}/episodes/${res.id}`)
            }
        }


    }
    // useEffect(() => {
    //     dispatch(getAllAnimeThunk())
    // }, [dispatch])

    // useEffect(() => {
    //     // console.log(videoLink)
    // }, [episodeNum, description, releaseDate, videoLink])

    return (
        <div className="createAnimeFormContainer">
            <h1 className="formHeader">Create an Episode for your Anime</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Episode Title:
                    <input
                        placeholder="Title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <p className="formError">{errors.title}</p>
                </label>
                <label>
                    Description:
                    <input
                        placeholder="Add a detailed description of your show here!"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <p className="formError">{errors.description}</p>
                </label>
                <label>
                    Release Date:
                    <input
                        placeholder=""
                        type="date"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                    />
                    <p className="formError">{errors.videoLink}</p>
                </label>

                <label>
                    Episode Number:
                    <input
                        placeholder=""
                        type="number"
                        value={episodeNum}
                        onChange={(e) => setEpisodeNum(e.target.value)}
                    />
                    <p className="formError">{errors.episodeNum}</p>
                </label>
                <label>
                    Episode Cover Image:
                    <input
                        placeholder="insert a file here "
                        type="file"
                        accept='image/*'
                        filename={coverPicture && coverPicture.name}
                        onChange={(e) => setCoverPicture(e.target.files[0])}
                    />
                    <p className="formError">{errors}</p>
                </label>
                <label>
                    Video File:
                    <input
                        placeholder="insert a file here "
                        type="file"
                        accept='video/*'
                        filename={videoLink && videoLink.name}
                        onChange={(e) => setVideoLink(e.target.files[0])}
                    />
                    <p className="formError">{errors}</p>
                </label>
                    {videoLink && videoLink.name && (
                        <button onClick={(e) => resetFile(e)}>Remove File</button>
                    )}
                <button>Submit Episode</button>

            </form>


        </div>
    )
}

export default EpisodeForm