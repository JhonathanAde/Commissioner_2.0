import React, {useState, useEffect} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import Rating from 'react-rating';
import { getRatingsByCommissionId } from '../../services/ratings';

import "./profilepage.css";
import ProfileCommCards from './ProfileComCards';
import Modal from '../../Components/Modal/Modal';
import CloseButton from '../../Components/CloseButton';
import { editBasicInfo, editUserName, uploadProfilePic } from '../../services/auth';
import Toggle from '../../Components/Toggle';
import Loader from '../../Components/Loader';



const Profilepage = ({authenticated, user}) => {

  const [artistInfo, setArtistInfo] = useState({});
  const [commissions, setCommissions] = useState([]);
  const [isComm, setComm] = useState(true);
  const [isGallery, setGallery] = useState(false);
  const [isReq, setReq] = useState(false);
  const [isSettings, setSettings] = useState(false);
  const [isBasicInfo, setBasicInfo] = useState(true);
  const [isSecurity, setSecurity] = useState(false);
  const [isStatus, setStatus] = useState(false);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [website, setWebsite] = useState(user.website);
  const [bio, setBio] = useState(user.bio);
  const [occupation, setOcc] = useState(user.occupation);
  const [currentPic, setPic] = useState(user.profile_pic);
  const [requests, setRequests ] = useState([]);
  const [errors, setErrors] = useState([]);
  const [nameVisible, setNameVisible] = useState(user.show_name);
  const [isLoading, setLoading] = useState(true);

  let artistId = useParams().userId;
  let isUser = useParams().username;
  let current = "user";
  let currentId = user.id;
  let navigate = useNavigate();


  const closeModal = (e) => {
    setSettings(false);
    resetBasicInfo(e);
  }

  const updateFirstName = (e) => {
    e.preventDefault();
    setFirstName(e.target.value);
  }

  const updateLastName = (e) => {
    e.preventDefault();
    setLastName(e.target.value);
  }

  const updateWebsite = (e) => {
    e.preventDefault();
    setWebsite(e.target.value);
  }

  const updateBio = (e) => {
    e.preventDefault();
    setBio(e.target.value);
  }

  const updateOccupation = (e) => {
    e.preventDefault();
    setOcc(e.target.value);
  }

  const resetBasicInfo = (e) => {
    e.preventDefault();
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setWebsite(user.website);
    setBio(user.bio);
    setOcc(user.occupation);
    setNameVisible(user.show_name);
  }

  const updatePhoto = async (e) => {
    e.preventDefault();

    let photo = e.target.files[0];
    let photoData = new FormData();

    photoData.append('file_path', photo);

    const photoUpload = await uploadProfilePic(photoData);
    console.log(photoUpload);

    if(photoUpload.errors){
      console.log(photoUpload.errors)
    } else {
      setPic(photoUpload.image_url);
    }
    
  }

  const submitBasicInfo = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("profile_pic", currentPic);
    data.append("first_name", firstName);
    data.append("last_name", lastName);
    data.append("website", website);
    data.append("bio", bio);
    data.append("occupation", occupation);
    data.append("show_name", nameVisible);

    let request = await editBasicInfo(data, user.id);

    if (request.errors) {
      console.log(request.errors);
    } else {
      window.location.reload();
    }
  }



  const checkUser = () => {

    if(!authenticated){
      currentId = artistId;
      current = "visitor";
      return currentId
    }
    
    else if(artistId !== undefined){
      if(artistId !== user.id.toString()){
        currentId = artistId;
        current = "visitor";
      }
      return currentId
    } 
    else {
      currentId = user.id;
      current = "user"
      return currentId;
    }
    
  }


  checkUser();


  ;
    

  
  useEffect(() => {

    window.scrollTo(0,0);
    setLoading(false);

    if(current === "user"){
      navigate(`/${user.username}/profile`);
    }

    const getArtistInfo = async (id) => {
        const artists = await fetch(`/api/users/user/${id}`)
        const json = await artists.json();
        setArtistInfo(json);
          // console.log(json)
        
      }
  
      const getComms = async (id) => {
        const result = await fetch(`/api/commissions/${id}/commission`);
        const json = await result.json();
        setCommissions(json.commissions);
      }

      const getRequests = async (id) => {
        const data = await fetch(`/api/requests/${id}/request`);
        const response = await data.json();
        console.log(response.requests);

        setRequests(response.requests);
      }

      // const showFullName = () => {
      
      // }


      getComms(currentId);
      getRequests(currentId);
      getArtistInfo(currentId);
    
  }, [current, currentId, isSettings, firstName, lastName, website, bio, nameVisible, artistId, isLoading]);


  console.log(artistInfo);
  // console.log(info);
  // console.log(typeof info.userId);
  

  return (
    <>
      {authenticated && current === "user" &&

        <>
        <div className='profilepage-user-main' data-page>
          <div className='profilepage-user-banner' style={{
              backgroundImage: `url("${artistInfo.banner}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <button 
              id="settings-button"
              onClick={() => {
                setSettings(true);
              }}
              >Edit Profile</button>
          </div>
          
          <div className='profilepage-user-content'>
              <div className='profilepage-user-artistcard'>
                { !isLoading ? 

                  <div className='artist-info animate reveal'>
                    <picture>
                      <img src={artistInfo.profilePic}></img>
                    </picture>

                    <div className='artist-aliases'>
                      <h1>{artistInfo.username}</h1>
                      { artistInfo.showName &&
                        <p>{`${artistInfo.firstName} ${artistInfo.lastName}`}</p>
                      }
                    </div>
                    <h2>{artistInfo.occupation}</h2>
                    <p>{artistInfo.bio}</p>
                    <h3>{artistInfo.location}</h3>
                    <a href={artistInfo.website}>Website</a>
                  </div>
                  :
                  <div className='loading-container'>
                    <Loader />
                  </div>
                }
              </div>

              <div className='profilepage-user-body'>
                <div className='user-body-left'>
                </div>
                <div className='user-body-right'>
                  <div className='user-action-bar'>
                    <button className={!isComm ? 'actionbar-btn' : 'actionbar-btn active'} onClick={() => {
                      if(isGallery || isReq){
                        setGallery(false);
                        setReq(false);
                        setComm(true);
                      }
                    }}>Commissions</button>
                    {/* <button className={!isGallery ? 'actionbar-btn' : 'actionbar-btn active'} onClick={() => {
                      if(isComm){
                        setComm(false);
                        setGallery(true);
                      }
                    }}>Gallery</button> */}
                    <button className={!isReq ? 'actionbar-btn' : 'actionbar-btn active'} onClick={() => {
                      if(isComm || isGallery){
                        setComm(false);
                        setGallery(false);
                        setReq(true);
                      }
                    }}>Requests</button>
                  </div>
                  <div className='actionbar-display'>
                    {!isLoading && isComm ?
                  
                      <>
                        {commissions && commissions.map((com, key) => {
                          let {id, title, image_url, user, price} = com

                          return(
                            <div key={key} className="animate wipe-up">
                              <ProfileCommCards id={id} title={title} image={image_url} user={user} price={price}/>
                            </div>
                          )
                      })}
                      </>

                    :!isLoading && isReq ?

                    <>
                      {requests && requests.map((req, key) => {
                            return(
                              <>
                               <h1>hello world</h1>
                              </>
                            )
                          })}
                      
                      {requests.length === 0 && 
                        <div className='noreq-msg animate wipe-up'>
                          <h1>No requests are available.</h1>
                        </div>
                      
                      }
                    </>
                    :
                    <div className='loading-container'>
                      <Loader />
                    </div>
                  }
                  </div>
                </div>
              </div>
              <Modal open={isSettings}>
               <div className='settings-modal animate wipe-up'>
                  <div className='modal-close-banner'>
                    <h1>Basic Info</h1>
                    <CloseButton close={closeModal}/>
                  </div>
                  <div className='settings-modal-body'>
                    {/* <div className='settings-options-menu'>
                      <ul>
                        <li onClick={() => {
                          setSecurity(false);
                          setBasicInfo(true);
                        }}>Basic Info</li>
                        <li
                          onClick={() => {
                            setBasicInfo(false);
                            setSecurity(true);
                          }}
                        >Security</li>
                        <li>Status</li>
                      </ul>
                    </div> */}

                    <div className='settings-modal-content'>
                      {isBasicInfo &&

                        <>
                          <div className='settings-profile-pic'>
                              <input type="file" id="changeProfile" onChange={updatePhoto} hidden></input>
                            <label className="chng-profile-btn" htmlFor="changeProfile" >
                              <div className='settings-profile-overlay'></div>
                              <picture>
                                <img src={currentPic}/>
                              </picture>
                            </label>
                            <h3>Replace</h3>
                          </div>
                          <form className='basic-info-form' onSubmit={(submitBasicInfo)}>
                            <div data-input-layout>
                              <label>First Name</label>
                              <input value={firstName} onChange={updateFirstName}></input>
                            </div>
                            <div className='basic-info-lastname' data-input-layout>
                              <label>Last Name</label>
                              <input value={lastName} onChange={updateLastName}></input>
                            </div>
                            <div className='basic-info-occupation' data-input-layout>
                              <label>Occupation</label>
                              <input value={occupation ? occupation : ''} onChange={updateOccupation}></input>
                            </div>
                            <div className='basic-info-website' data-input-layout>
                              <label>Website</label>
                              <input value={website} onChange={updateWebsite}></input>
                            </div>
                            <div className="basic-info-bio" data-input-layout>
                              <label>Bio</label>
                              <textarea value={bio} onChange={updateBio}></textarea>
                            </div>
                            <div className='basic-info-fullname-toggle'>
                              <label>Show Full Name?</label>
                              <Toggle isActive={nameVisible} setActive={setNameVisible}/>
                            </div>

                            <div className='basic-info-form-btns'>
                              <button type='submit'>Save</button>
                              <button onClick={resetBasicInfo}>Reset</button>
                            </div>
                          </form>
                        </>  
                      }
                      {isSecurity &&

                        <div className='settings-security'>

                        </div>

                      }
                    </div>
                  </div>
              </div>
              </Modal>     
          </div>
        </div>
        </>
      }

      { current === "visitor" &&
        <div className='profilepage-visitor-main' data-page>
          <div className='profilepage-visitor-banner' 
            style={{
              backgroundImage: `url("${artistInfo.banner}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          
          <div className='profilepage-visitor-content'>
              <div className='profilepage-visitor-artistcard'>
                <div className='artist-info'>
                  <picture>
                    <img src={artistInfo.profilePic}></img>
                  </picture>
                  <div className='artist-aliases'>
                    <h1>{artistInfo.username}</h1>
                    { artistInfo.showName &&
                      <p>{`${artistInfo.firstName} ${artistInfo.lastName}`}</p>
                    }
                  </div>
                  <h2>{artistInfo.occupation}</h2>
                  <p>{artistInfo.bio}</p>
                  <h3>{artistInfo.location}</h3>
                  <a href={artistInfo.website}>Website</a>
                </div>
                {/* <div className='profilepage-artistcard-btns'>
                  <button>Follow</button>
                  <button>Message</button>
                </div> */}
              </div>

              <div className='profilepage-visitor-body'>
                <div className='visitor-body-left'></div>
                <div className='visitor-body-right'>
                  <div className='visitor-action-bar'>

                    <button className={!isComm ? 'actionbar-btn' : 'actionbar-btn active'} onClick={() => {
                      if(isGallery || isReq){
                        setGallery(false);
                        setReq(false);
                        setComm(true);
                      }}}>Commissions</button>
                    {/* <button className={!isGallery ? 'actionbar-btn' : 'actionbar-btn active'} onClick={() => {
                      if(isComm){
                        setComm(false);
                        setGallery(true);
                      }
                    }}>Gallery</button> */}
                    <button className={!isReq ? 'actionbar-btn' : 'actionbar-btn active'} onClick={() => {
                      if(isComm || isGallery){
                        setComm(false);
                        setGallery(false);
                        setReq(true);
                      }
                    }}>Request</button>
                  </div>
                  <div className='actionbar-display'>
                    {!isLoading && isComm ?
                    
                    <>
                    
                      {commissions && commissions.map((com, key) => {
                        let {id, title, image_url, user, price} = com

                        return(
                          <div key={key} className="animate wipe-up">
                            <ProfileCommCards id={id} title={title} image={image_url} user={user} price={price}/>
                          </div>
                        )
                      })}
                    </>

                    :!isLoading && isReq ?

                    <>
                      {requests && requests.map((req, key) => {
                            return(
                              <>
                              </>
                            )
                          })}
                      
                      {requests.length === 0 && 
                        <div className='noreq-msg animate wipe-up'>
                          <h1>No requests are available.</h1>
                        </div>
                      }
                    </>
                    :
                    <div className='loading-container'>
                      <Loader />
                    </div>
                  }
                  </div>
                </div>
              </div>
          </div>
        </div>
      }
    </>
  )
}

export default Profilepage;