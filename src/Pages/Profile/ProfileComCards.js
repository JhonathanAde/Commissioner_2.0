// Dependencies
import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import Rating from 'react-rating';
import Loader from '../../Components/Loader';

// CSS

const ProfileCommCards = ({comm, id, title, image, price, user}) => {

  const [reviews, setReviews] = useState([]);
  const [reviewLength, setLength] = useState(0);
  const [isOverlay, setOverlay] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isLandscape, setLandscape] = useState(false);


  useEffect(() => {

    if(image !== null){
      let img = new Image();
      img.src = image;

      img.onload = (e) => {
        if(img.width > img.height){
          setLandscape(true);
        }
        setLoading(false);
      }
    }

    const getRatingsById = async (id) => {
        const result = await fetch(`/api/ratings/${id}/rating`)
        const json = await result.json();
        setReviews(json);
        setLength(json.ratings.length);
      }

       getRatingsById(id);
    

  }, []);

  var averageRating = 0
  let average = 0
  let emptyStars = <i className="far fa-star fa-1x"></i>
  let fullStars = <i className="fas fa-star fa-1x"></i>

   const calculateAverageRating = () => {
    let sum = 0 
    for(let i = 0; i < reviewLength; i++){
      let eachRating = reviews.ratings[i].rating;
      sum += eachRating;
    }

    average = isNaN((sum/reviewLength)) ? 0 : (sum/reviewLength).toFixed(1);
    averageRating = Math.floor(sum / reviewLength);
    
  }

  calculateAverageRating();


  return (
    <>
      <div className="profile-comm-cards"> 
      {!isLoading ?
      
          <div className='profile-comm-card-img animate reveal'
            onMouseOver={() => {
              setOverlay(true);
            }}
            onMouseLeave={() => {
              setOverlay(false);
            }}
          >
              <NavLink to={`/product/${id}`}>
                <div
                  className='procomcard-img'
                  style={{
                          backgroundImage: `url("${image}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                ></div>
              </NavLink>
  
            
                <div className={!isOverlay ? 'profile-comm-card-overlay' : 'profile-comm-card-overlay active'}></div>
                <NavLink to={`/product/${id}`}>
                  <h1 className={!isOverlay ? 'profile-comm-card-title' : 'profile-comm-card-title active'}>{title}</h1>
                </NavLink>

                </div>
            
              :
              <div className='profile-comm-card-img'
            onMouseOver={() => {
              setOverlay(true);
            }}
            onMouseLeave={() => {
              setOverlay(false);
            }}
            >
  
              <div className='loading-container-card'>
                <Loader />
              </div>
            
                <div className={!isOverlay ? 'profile-comm-card-overlay' : 'profile-comm-card-overlay active'}></div>
                <NavLink to={`/product/${id}`}>
                  <h1 className={!isOverlay ? 'profile-comm-card-title' : 'profile-comm-card-title active'}>{title}</h1>
                </NavLink>

                </div>
            }
          <div className='profile-comm-card-info'>
            <div className='card-info-user'>
              <picture>
                <img src={user.profile_pic}/>
              </picture>
              <h3>{user.username}</h3>
            </div>
            <div className='card-info-ratings'>
              <Rating emptySymbol={emptyStars} fullSymbol={fullStars} initialRating={averageRating} readonly/>
              <p>/&nbsp;{average}</p>
            </div>
            <div className='card-info-price'>
              <p>${price}</p>
            </div>
          </div>
      </div>
   </>
  )
}

export default ProfileCommCards;