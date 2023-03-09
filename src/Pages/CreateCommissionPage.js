import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommission, uploadCommissionImage } from '../services/commission';
import './createcommission.css';

import placeHolder from './../Logo/img_placeholder.png'


const CreateCommissionPage = ({authenticated, user}) => {
  const [title, set_Title] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [price, setPrice] = useState('');
  const [requests, setRequests] = useState('');
  const [expire, setExpire] = useState(false);
  const [errors, setErrors] = useState([]);
  const [orientation, setOrientation] = useState('square');

  const history = useNavigate();

  const checkOrientation = (imgsrc) => {
    let image = new Image();
    image.src = imgsrc;

    image.onload = () => {
      if(image.height > image.width){
        setOrientation('portrait');
      }
      else if (image.width > image.height){
        setOrientation('landscape');
      }
      else {
        setOrientation('square');
      }
    }
  }

  const updateTitle = (e) => {
    e.preventDefault();

    set_Title(e.target.value);
  }

  const updateDescription = (e) => {
    e.preventDefault();

    setDescription(e.target.value);
  }

  const updateImage = async (e) => {
    e.preventDefault();

    let data = new FormData()
    let image = e.target.files[0];

    data.append('file_path', image);



    let response = await uploadCommissionImage(data);

    if(response.errors){
      setErrors(response.errors);
    } else {
      let {image_url} = response;
      checkOrientation(image_url);
      setImg(image_url);
      // console.log(typeof image_url);
    }
  }

  const updatePrice = (e) => {
    e.preventDefault();

    setPrice(e.target.value);
  }

  const updateReqs = (e) => {
    e.preventDefault();

    setRequests(e.target.value);
  }

  const updateExpire = (e) => {
    e.preventDefault();

    setExpire(e.target.value);
  }

  

  useEffect(() => {
  
    console.log(expire);
  }, [img, expire])



  

  const onSubmit = async (e) => {
    e.preventDefault();

    let data = new FormData();
    let date = new Date();
    let month = date.getUTCMonth() + 1;
    let year = date.getUTCFullYear();
    let day = date.getUTCDate();
    let fullDate = `${year}-${month}-${day}`;
   

    data.append('title', title);
    data.append('description', description);
    data.append('image_url', img);
    data.append('price', price);
    data.append('request_amt', requests);
    data.append('date_created', fullDate);
    data.append('duration', "");
    data.append('expired', expire);
    data.append('user_id', user.id);

    let response = await createCommission(data);

    if(response.errors){
      setErrors(response.errors);
    } else {
      history(`/${user.username}/profile`);
    }

  }

  return (
    <div className='create-commission-page_main' data-page>
      <div className='create-commission-page_content'>
        <div className='create-commission_title'>
          <h1>Create a Commission</h1>
        </div>
        <div className="create-commission_data animate wipe-up">

          <div className='create-commission_img-display'>
            <div className='img-display_frame'>

              {!img ?
               
               <picture>
                <img src={placeHolder}/>
               </picture>
          
              : orientation === 'portrait' ?
                <picture>
                  <img className="img-portrait" src={img}></img>
                </picture>
              : orientation === 'landscape' ?
                <picture>
                  <img className="img-landscape" src={img}></img>
                </picture>
              : orientation === 'square' &&
                <picture>
                  <img className="img-square" src={img}></img>
                </picture>

              }
            </div>
          </div>
            <form className='commission-form' onSubmit={onSubmit}>
              <div className="commission-title" data-input-layout>
                <label>Title</label>
                <input onChange={updateTitle}></input>
              </div>
              <div className="commission-description" data-input-layout>
                <label>Description</label>
                <textarea onChange={updateDescription}></textarea>
              </div>
              <div className="commission-upload" data-input-layout>
                <label>Upload Image</label>
                <input type="file" onChange={updateImage}></input>
              </div>
              <div className="commission-price" data-input-layout>
                <label>Price</label>
                <input type="number" onChange={updatePrice}></input>
              </div>
              <div className="commission-rqsts-limit" data-input-layout>
                <label>Number of Requests</label>
                <input type="number" onChange={updateReqs}></input>
              </div>
              <div className="commission-exp-btn" data-input-layout>
                <label>Does this commission expire?</label>
                <div className='exp-btns'>
                  <div data-status-buttons>
                    <label>Yes</label>
                    <input type="radio" name="exp-date" value={true}></input>
                  </div>
                  <div data-status-buttons>
                    <label>No</label>
                    <input type="radio" name="exp-date" value={false}></input>
                  </div>
                </div>
              </div>
              <div data-input-layout>
                <label>Expiration Date</label>
                <input type="date" onChange={updateExpire}></input>
              </div>

              <div className='create-submit-btns'>
                <button type='submit'>Submit</button>
                <button>Reset</button>
              </div>
            </form>
        </div>
      </div>

    </div>
  );
}

export default CreateCommissionPage;