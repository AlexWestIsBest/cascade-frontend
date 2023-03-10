import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { updateFbProfile, 
        updateFbEmail, 
        deleteAccount, 
        updateFbPassword, logOut } from "../firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = ({ user }) => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");

    // empty user object
    const formUser = {
        uid: "",
        email: "",
        displayName: ""
    }

    // create state variable for user profile
    // const [currentUser, setCurrentUser] = useState();
    const [profile, setProfile] = useState(formUser);

    useEffect(() => {
        if (user) {
            // setUpdateForm(user);
            setProfile(user);
            // console.log(updateForm)
        } 
    }, [user])

    const handleChange = (event) => {
        setProfile({ ...profile, [event.target.name]: event.target.value });
    };

    const currentUser = user ? user : formUser;

    // test for empty displayName
    if (!currentUser.displayName) {
        currentUser.displayName = "No User Info"
    }

    const updateProfile = async (e) => {
        e.preventDefault();
        const name = profile.displayName;
        const email = profile.email;
        try {
            await updateFbEmail(email).then(() => {
                // Update successful.
                // console.log('Home Update successful.')
                })
        } catch (error) {
            console.log(error)
            if(error.code === 'auth/email-already-in-use'){
                toast.error('Account Already Exists');
            }
        }
        try {
            await updateFbProfile(name, email).then(() => {
                // Update successful.
                // console.log('Home Update successful.')
                })
        } catch (error) {
            // console.log(error)
            toast.error('Error Updating Account');
        }
        // logOut();
        navigate('/')
    }

    const handleNewPassword = (event) => {
        setNewPassword(event.target.value);
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        try {
            await updateFbPassword(currentUser, newPassword).then(() => {
                // Update successful.
                toast.success('Password Updated')
                logOut();
                navigate('/login');
                })
        } catch (error) {
            // console.log(error)
            toast.error('Error Updating Password');
        }
    }
            
    const delAccount = async () => {
        await deleteAccount();
        navigate('/login');
    }

    // loaded state
    const loaded = () => {
        let userName = null
        if (!currentUser.displayName || currentUser.displayName === "No User Info") {
            // currentUser.displayName = "No User Info"
            userName = currentUser.email
        } else {
            userName = currentUser.displayName.split(" ")[0];
        }

        return (
            <section>
            <div className='homePage'>
                <h3>
                    Welcome to Cascade
                </h3>
                <form className="updateForm" >
                        <span>
                            <label htmlFor="email">Email: </label>
                            <input 
                                type="text" 
                                name="email" 
                                value={profile.email}
                                onChange={handleChange}
                            />
                        </span>
                        <span>
                            <label htmlFor="displayName">Full Name: </label>
                            <input 
                                type="text" 
                                name="displayName"
                                value={profile.displayName}
                                onChange={handleChange}
                            />
                        </span>
                        <button
                            type="button"
                            className='btn btn-sm btn-success'
                            onClick={updateProfile}
                            ><span className="bi bi-archive"></span>&nbsp;Update Profile
                        </button>
                </form>
                <form className="updateForm" >
                        <span>
                            <label htmlFor="newPassword">New Password: </label>
                            <input 
                                type="password" 
                                name="newPassword" 
                                value={newPassword}
                                onChange={handleNewPassword} 
                            />
                        </span>
                        <button
                            type="button"
                            className='btn btn-sm btn-success'
                            onClick={updatePassword}
                            ><span className="bi bi-arrow-clockwise"></span>&nbsp;Set Password
                        </button>
                </form>
                <div className="delDiv">
                    <button
                        type="button"
                        className='btn btn-sm btn-danger' 
                        onClick={delAccount}
                        ><span className="bi-trash"></span>&nbsp;Delete Account
                    </button>
                </div>
                <span>
                    UID: {profile.uid}
                </span>
            </div>
            <ToastContainer />
            </section>
        )
    }

    const loading = () => {
        return <h3>Loading...</h3>
    }

    return (
        <section>
            {user ? loaded() : loading()}
        </section>
    )

};

export default Home;