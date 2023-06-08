import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getAnimeEpisodesThunk } from "../../store/animeDetail";
import { getAnimeReviewsThunk } from "../../store/reviews";
import './index.css'

function EpisodeComponent(){

    const dispatch = useDispatch();
    const {episodeId} = useParams();
    const {animeId} = useParams();

    const episodesOfAnimeObj = useSelector((state)=>state.episodes);
    const episodesOfAnime = Object.values(episodesOfAnimeObj)
    let currentEpisode = {};

    episodesOfAnime.forEach((ep) => {
        if(ep.id == episodeId)
        currentEpisode = ep
    })
    console.log('-------------------',episodesOfAnimeObj)
    console.log('this is the current episode------',currentEpisode)

    useEffect(() => {
        dispatch(getAnimeReviewsThunk(animeId));
        dispatch(getAnimeEpisodesThunk(animeId));
        //there will? be a thunk to add the anime to the user's favorites
      }, [dispatch]);
      if(!currentEpisode) return null

      else
      return(
        <div className = 'episodeComponentDiv'>
                <h2>{currentEpisode.title}</h2>

                <div className = 'videoplayerandDescription'>
                  <video width='700px' height = '400px' controls>
                      <source src = {currentEpisode.videoLink} type= 'video/mp4'>
                      </source>
                  </video>

                  <p className = 'descriptionDivEpisode'>
                  {currentEpisode.desc}
                  </p>

                </div>
        </div>
      )

}

export default EpisodeComponent;