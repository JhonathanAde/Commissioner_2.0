import React, {useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import Rating from 'react-rating';
import { getRatingsByCommissionId } from "../../services/ratings";

// Styling //
import "../Card/comcardhm.css";
import Loader from "../Loader";

const ComCardHm = ({com}) => {

  const [isHover, setIsHover] = useState(false);
  const [isOverlay, setOverlay] = useState(false);
  const [review, setReviews] = useState(null);
  const [reviewLength, setReviewLength] = useState(0);
  const [isLoading, setLoading] = useState(true);

  // Variables //
  var averageRating = 0
  let average = 0
  const {user, title, price, image_url, id} = com;
  const {username, profile_pic} = user;
  // console.log(user)
  let emptyStars = <i className="far fa-star fa-1x"></i>
  let fullStars = <i className="fas fa-star fa-1x"></i>


  // Helper Functions //

  const calculateAverageRating = () => {
    let sum = 0 
    for(let i = 0; i < reviewLength; i++){
      let eachRating = review.ratings[i].rating;
      sum += eachRating;
    }

    average = isNaN((sum/reviewLength)) ? 0 : (sum/reviewLength).toFixed(1);
    averageRating = Math.floor(sum / reviewLength);
    

  }

  const overlayActive = (e) => {
    e.preventDefault();

    if(!isOverlay){
      setOverlay(true);
    }
  }

  
  useEffect(() => {

    if(image_url !== null){
      let img = new Image();
      img.src = image_url;

      img.onload = () => {
        console.log("here")
        setLoading(false);
      }
    }



    (async () => {
      const userReviews = await getRatingsByCommissionId(id)
      setReviews(userReviews);
      setReviewLength(userReviews.ratings.length)
    })()


  }, [])

  calculateAverageRating();  

  return (
    <>
      <div className='art-display-card animate wipe-up'>

        {!isLoading ? 
          <div 
            className='display-card-photo animate reveal' 
            onMouseOver={() => {setOverlay(true)}}
            onMouseLeave={() => { setOverlay(false);}}
            >
            <NavLink to={`/product/${id}`}>
             <div className="card-photo"
              style={{
              backgroundImage: `url("${image_url}")`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
             ></div> 
            </NavLink>

            

              <>
                <div className={!isOverlay ? 'display-card-overlay' : 'display-card-overlay active'}></div>
                <h1 className={!isOverlay ? 'display-card-title' : 'display-card-title active'}>
                <NavLink to={`/product/${id}`}>{title}</NavLink>
                </h1>
              </>
              </div>

            

          :

           <div 
            className='display-card-photo' 
            onMouseOver={() => {setOverlay(true)}}
            onMouseLeave={() => { setOverlay(false);}}
            >
              <div className="loading-container">
                <Loader />
              </div>

              <>
                <div className={!isOverlay ? 'display-card-overlay' : 'display-card-overlay active'}></div>
                <h1 className={!isOverlay ? 'display-card-title' : 'display-card-title active'}>
                <NavLink to={`/product/${id}`}>{title}</NavLink>
                </h1>
              </>

              </div>
            }
            

        <div className='display-card-info'>
          <div id="display-card__artistname" data-displaycard-info>
            <div id="display-card__userimg">
              <picture>
                <img src={profile_pic}/>
              </picture>
            </div>
            <h2>
              <NavLink to={`/profile/${user.id}`}>{username}</NavLink>
              </h2>
          </div>
          <div id="display-card__ratinginfo" data-displaycard-info>
            <Rating emptySymbol={emptyStars} fullSymbol={fullStars} initialRating={averageRating} readonly/>
            <p> / {average}</p>
          </div>
          <div id="display-card__pricing" data-displaycard-info>
            <h3>${price}</h3>
          </div>
        </div>
      </div>
    </>
  )
}

export default ComCardHm;