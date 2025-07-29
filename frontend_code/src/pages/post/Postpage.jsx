import React, { useState } from 'react'
import { createProductApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import './../post/postpage.css';

const PostPage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;

    const [productTitle, setProductTitle] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productLocation, setProductLocation] = useState('')
    const [productImage, setProductImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        setProductImage(file)
        setPreviewImage(URL.createObjectURL(file))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(productTitle, productCategory, productDescription, productImage, productPrice, productLocation)


        const formData = new FormData();
        formData.append('productTitle', productTitle);
        formData.append('productDescription', productDescription);
        formData.append('productCategory', productCategory);
        formData.append('productPrice', productPrice);
        formData.append('productLocation', productLocation)
        formData.append('productImage', productImage);
        formData.append('createdBy', userId)

        createProductApi(formData).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.message);
            }
            else {
                toast.error("something went wrong in forntend!")
            }
        }).catch((error) => {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.message)
                }
                else if (error.response.status === 500) {
                    toast.error('Internal server error!')
                }
                else {
                    toast.error("No response!")
                }
            }
        })



    }

    return (
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Post a Item</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="post-form-container">
                            <form className="form">
                                <label>
                                    Title*
                                    <input className='input-area' onChange={(e) => setProductTitle(e.target.value)} type="text" name="title" required />
                                </label>
                                <div>
                                    <label for="formFileDisabled" className="form-label">
                                        Choose Photo
                                    </label>
                                    <input className='input-area' onChange={handleImageUpload} type="file" />
                                    {
                                        previewImage && (
                                            <div className=''>
                                                <img src={previewImage} alt="preview image" className='img-fluid rounded object-fit-cover mt-3' />
                                            </div>
                                        )
                                    }
                                </div>


                                <div className='mt-2'>
                                    <label> Select Category *</label>
                                    <select onChange={(e) => setProductCategory(e.target.value)} className="input-area">
                                        <option >Arts and Crafts</option>
                                        <option >Toys and Collectibles</option>
                                        <option>Home and Living</option>
                                        <option >Wedding</option>
                                    </select>

                                </div>
                                <label>
                                    Price*
                                    <input className='input-area' onChange={(e) => setProductPrice(e.target.value)} type="text" name="price" required />
                                </label>
                                <label>
                                    Location Details*
                                    <input className='input-area' onChange={(e) => setProductLocation(e.target.value)} type="text" name="location" required />
                                </label>
                                <label>
                                    Description*
                                    <textarea className='input-area' onChange={(e) => setProductDescription(e.target.value)} name="description" required></textarea>
                                </label>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={handleSubmit} type="button" class="save_btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPage;