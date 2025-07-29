import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserDetails, deletePost, getAllProductsByUserId, updateUserDetails, updateProfileImage } from "../../apis/Api";
import "./../profilepage/profilepage.css";
import { FaCamera } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState(() => {
    // Safely parse user from localStorage
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  });

  // Ensure user._id exists
  const userId = user?._id;

  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [imagePreview, setImagePreview] = useState(profileImage || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast.error('User not found. Please log in again.');
      return;
    }
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = () => {
    if (!userId) return;
    getUserDetails(userId)
      .then((res) => {
        const userData = res.data.userDetails;
        setUser(userData);
        setImagePreview(`http://localhost:8848/profiles/${userData.profileImage}`);
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .catch((error) => {
        console.log(error);
        toast.error('Error fetching user details!');
      });
  };
  if (!userId) {
    return <p>User not found. Please log in again.</p>;
  }



  const getAllProducts = () => {
    if (!userId) return;
    getAllProductsByUserId(userId)
      .then((res) => {
        const approvedProducts = res.data.product.filter(product => product.isApproved);
        setProducts(approvedProducts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure you want to delete?");
    if (confirmDialog) {
      deletePost(id)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
            getAllProducts();
          } else {
            toast.error("Error deleting post!");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error deleting post!");
        });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageChanged(true);
  };

  const handleSaveChanges = () => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);

    updateUserDetails(userId, formData)
      .then((res) => {
        if (res.status === 200) {
          const updatedUser = res.data.user;
          toast.success("Profile updated successfully!");
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          setEditing(false);
        } else {
          toast.error("Error updating profile!");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error updating profile!");
      });
  };

  const handleUpdateImage = () => {
    if (!userId) return;
    const formData = new FormData();
    formData.append("profileImage", profileImage);

    updateProfileImage(userId, formData)
      .then((res) => {
        if (res.status === 200) {
          const updatedUser = res.data.user;
          toast.success("Profile image updated successfully!");
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          setImagePreview(`http://localhost:8848/public/profiles/${updatedUser.profileImage}`);
          setImageChanged(false);
        } else {
          toast.error("Error updating profile image!");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error updating profile image!");
      });
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
  };

  if (!userId) {
    return <p>User not found. Please log in again.</p>;
  }

  return (
    <div className="profile-page">
      <div className="sidebar">
        <div className="profile-section">
          <div className="profile-img-wrapper">
            <img src={imagePreview} alt="Profile" className="profile-img" />
            <label htmlFor="file-input" className="camera-icon">
              <FaCamera />
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            {imageChanged && (
              <button className="update-image-button" onClick={handleUpdateImage}>
                Upload Image
              </button>
            )}
          </div>
          <h2 className="profile-name">
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="edit-input"
              />
            ) : (
              user.fullName
            )}
          </h2>
          <p className="profile-email">
            {editing ? (
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="edit-input"
              />
            ) : (
              user.email
            )}
          </p>
          {editing ? (
            <>
              <button className="edit_button" onClick={handleSaveChanges}>Save</button>
              <button className="cancel_button" onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <button className="edit_button" onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>
      </div>
      <div className="main-content">
        <h2>Posted Products</h2>
        <div className="products-grid">
          {products.map((singleProduct) => (
            <div key={singleProduct._id} className="profile-module-card">
              <div className="product-img-container">
                <img
                  src={`http://localhost:8848/products/${singleProduct.productImage}`}
                  alt={singleProduct.productTitle}
                  className="product-img"
                />
              </div>
              <div className="module-info">
                <p className="module-title">{singleProduct.productTitle}</p>
                <div className="module-date-delete">
                  <p className="module-date">Price: Rs {singleProduct.productPrice}</p>
                  <button onClick={() => handleDelete(singleProduct._id)} className="btn profilebtn btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
