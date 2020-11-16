import React, {useState} from 'react'
import styles from './Account.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
        UpdateAccountNameHandler, 
        UpdateAccountEmailHandler, 
        UpdateAccountPasswordHandler} from '../../Services/AuthenticationService'
import {  UploadProfilePhotoHandler} from '../../Services/UserService'


const Account = props => {
    const {currentUser, titleCaseString} = props

    // Account Related State
    const [editNameIconShown, setEditNameIconShown] = useState(false)
    const [editEmailIconShown, setEditEmailIconShown] = useState(false)
    const [editPasswordIconShown, setEditPasswordIconShown] = useState(false)
    const [editPhotoIconShown, setEditPhotoIconShown] = useState(false)
    const [accountInfoShown, setAccountInfoShown] = useState(true)
    const [updateNameShown, setUpdateNameShown] = useState(false)
    const [updateEmailShown, setUpdateEmailShown] = useState(false)
    const [updatePasswordShown, setUpdatePasswordShown] = useState(false)
    const [updateProfilePhotoShown, setUpdateProfilePhotoShown] = useState(false)
    const [image, setImage] = useState('')
    const [preview, setPreview] = useState(false)
    const [name, setName] = useState(currentUser[0].user.name)
    const [email, setEmail] = useState(currentUser[0].user.email)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const [headerName, setHeaderName] = useState('Account Settings')

    // Account Related Asynchronous functions 
    const updateAccountName = UpdateAccountNameHandler()
    const updateAccountEmail = UpdateAccountEmailHandler()
    const updateAccountPassword = UpdateAccountPasswordHandler()
    const updateAccountPhoto = UploadProfilePhotoHandler()



    //Accounted Related Handler Functions  
    const nameChangeHandler = event => {
        let name = event.target.value
        setName(name)
    }

    const emailChangeHandler = event => {
        let email = event.target.value
        setEmail(email)
    }

    const passwordChangeHandler = event => {
        let password = event.target.value
        setPassword(password)
    }

    const confirmPasswordChangeHandler = event => {
        let confirmPassword = event.target.value
        setConfirmPassword(confirmPassword)
    }


    const imageChangeHandler = async event => {
        setImage(event.target.files[0])
        setPreview(true)
        
    }

    const clearImageHandler = () => {
        setPreview(false)
        setImage('')
    }


    // Universal Handler Function for any account related updates 
    const onSubmitHandler = async (event, field)=> {
        event.preventDefault()

        if (field === 'name') {
            await updateAccountName(currentUser[0].token, titleCaseString(name))
            setUpdateNameShown(false)
            setHeaderName('Account Settings')
        }  

        if (field === 'email') {
            await updateAccountEmail(currentUser[0].token, email)
            setUpdateEmailShown(false)
            setHeaderName('Account Settings')
        }

        if (field === 'password') {
            if (password !== confirmPassword) {
                setError('Passwords Must Match')
                return
            }
            await updateAccountPassword(currentUser[0].token, password )
            setUpdatePasswordShown(false)
            setHeaderName('Account Settings')

        }

        if (field === 'photo') {
            
            await updateAccountPhoto(currentUser[0].token, image)
            setUpdateProfilePhotoShown(false)
            setPreview(false)
            setImage('')
        }
        setAccountInfoShown(true)
        document.location.reload()
      
    }


    return (
        <div className={styles.AccountContainer}>     
            <div className={styles.Account}>
            <h1>{headerName}</h1>

            {/* Account Information JSX */}
            {accountInfoShown ? 
                <div 
                    className={styles.ProfilePhotoContainer}
                    onClick={() => {
                        setAccountInfoShown(false)
                        setUpdateProfilePhotoShown(true)
                        setHeaderName('Update Profile Photo')
                        }}
                        onMouseEnter={() => setEditPhotoIconShown(true)}
                        onMouseLeave={() => setEditPhotoIconShown(false)}>
                    <img 
                        alt="profile" 
                        className={styles.DefaultAvatar} 
                        src={`/users/${currentUser[0].user._id}/avatar`} />
                    <p 
                     className={styles.Edit}
                     style={editPhotoIconShown ? {textDecoration:'underline'} : {textDecoration:'none'}}>
                     {editPhotoIconShown ? 
                        <FontAwesomeIcon className={styles.Icon} icon={['fas', 'pen']} /> 
                        : null }
                         Edit 
                    </p>
                </div>
            : null }

            {accountInfoShown ? 
                <div className={styles.Data}>
                    <span 
                        className={styles.Information}
                        onClick={() => {
                            setAccountInfoShown(false)
                            setUpdateNameShown(true)
                            setHeaderName('Update Name')
                        }}
                        onMouseEnter={() => setEditNameIconShown(true)}
                        onMouseLeave={() => setEditNameIconShown(false)}>
                            <p className={styles.Bold}>Name: </p>
                            <p>{currentUser[0].user.name}</p>
                    
                            <p 
                                className={styles.Edit}
                                style={editNameIconShown ? {textDecoration:'underline'} : {textDecoration:'none'}}> 
                                {editNameIconShown ? 
                                    <FontAwesomeIcon className={styles.Icon} icon={['fas', 'pen']} /> 
                                    : null } 
                                    Edit 
                            </p>
                    </span>
                    <span 
                        className={styles.Information}
                        onClick={() => {
                            setAccountInfoShown(false)
                            setUpdateEmailShown(true)
                            setHeaderName('Update Email')
                        }}
                        onMouseEnter={() => setEditEmailIconShown(true)}
                        onMouseLeave={() => setEditEmailIconShown(false)}>
                            <p className={styles.Bold}>Email: </p>
                            <p>{currentUser[0].user.email}</p>
                    
                            <p 
                                className={styles.Edit}
                                style={editEmailIconShown ? {textDecoration:'underline'} : {textDecoration:'none'}}> 
                                {editEmailIconShown ? 
                                    <FontAwesomeIcon className={styles.Icon} icon={['fas', 'pen']} /> 
                                    : null } 
                                    Edit 
                            </p>
                    </span>
                    <span 
                        className={styles.Information}
                        onClick={() => {
                            setAccountInfoShown(false)
                            setUpdatePasswordShown(true)
                            setHeaderName('Update Password')
                        }}
                        style={window.innerWidth <=650 ? {paddingBottom:'5%'} : {paddingBottom:'none'}}
                        onMouseEnter={() => setEditPasswordIconShown(true)}
                        onMouseLeave={() => setEditPasswordIconShown(false)}>
                            <p className={styles.Bold}>Password: </p>
                            <p>Hidden</p>
                    
                            <p 
                                className={styles.Edit}
                                style={editPasswordIconShown ? {textDecoration:'underline'} : {textDecoration:'none'}}>
                                {editPasswordIconShown ? 
                                    <FontAwesomeIcon className={styles.Icon} icon={['fas', 'pen']} /> 
                                    : null } 
                                    Edit 
                            </p>
                    </span>
            </div> : null }
           {accountInfoShown ? 
                <p className={styles.Redirect} onClick={() => props.history.push('/chat')} ><FontAwesomeIcon icon={['fas', 'hand-point-right']} /> Back to Application.</p>  
            : null}
    
            {/* End of Account Information JSX */}

            {/* Update Name Form JSX */}
            {updateNameShown ? 
                <form 
                    className={styles.UpdateForm} 
                    onSubmit={(event) => onSubmitHandler(event, 'name')}>
                    <div>
                        <label className={styles.Bold}>Name </label>
                            <input 
                                type="text" 
                                required
                                placeholder="Name"
                                value={name} 
                                onChange={nameChangeHandler}/>
                       
                    </div>
                    <div className={styles.UpdateButtons}>
                        <button className={styles.UpdateButton} type="submit">Update</button>
                        <button className={styles.CancelButton} onClick={() =>{
                            setUpdateNameShown(false)
                            setAccountInfoShown(true)
                            setHeaderName('Account Settings')
                        }}>Cancel</button>
                    </div>
                </form> 
                : null }
            {/* End of Update Name Form JSX */}


            {/* Update Email Form JSX */}
            {updateEmailShown ? 
                <form 
                    className={styles.UpdateForm} 
                    onSubmit={(event) => onSubmitHandler(event, 'email')}>
                    <div>
                        <label className={styles.Bold}>Email </label>
                      
                            <input 
                                type="email" 
                                required
                                placeholder="email"
                                value={email} 
                                onChange={emailChangeHandler}/>
                       
                    </div>
                    <div className={styles.UpdateButtons}>
                        <button className={styles.UpdateButton} type="submit">Update</button>
                        <button className={styles.CancelButton} onClick={() =>{
                            setUpdateEmailShown(false)
                            setAccountInfoShown(true)
                            setHeaderName('Account Settings')
                        }}>Cancel</button>
                    </div>
                </form> 
                : null }

            {/* End of Update Email Form JSX */}


            {/* Update Password Form JSX */}
            {updatePasswordShown ? 
                <form 
                className={styles.UpdateForm} 
                onSubmit={(event) => onSubmitHandler(event, 'password')}>
                    <div>
                        <div>
                            <label className={styles.Bold}>New Password </label>
                                <input 
                                    type="password" 
                                    required
                                    minLength="6"
                                    placeholder="password"
                                    value={password} 
                                    onChange={passwordChangeHandler} 
                                 />
                        </div>
                        <div>
                            <label className={styles.Bold}>Confirm New Password </label>
                                <input 
                                    type="password" 
                                    required
                                    minLength="6"
                                    placeholder="confirm password"
                                    value={confirmPassword} 
                                    onChange={confirmPasswordChangeHandler}
                                  />
                        </div>
                    </div>

                    <div className={styles.UpdateButtons}>
                        <button className={styles.UpdateButton} type="submit">Update</button>
                        <button className={styles.CancelButton} onClick={() =>{
                            setUpdatePasswordShown(false)
                            setAccountInfoShown(true)
                            setHeaderName('Account Settings')
                        }}>Cancel</button>
                    </div>
                    <p>{error? error : ''}</p>
                </form> 

                : null }

            {/* End of Update Password Form JSX */}

            {/* Edit Profile Photo Form JSX */}
            {updateProfilePhotoShown? 
                <form 
                    className={styles.UpdateForm} 
                    onSubmit={(event) => onSubmitHandler(event, 'photo')}>
                    {preview ? 
                        <div className={styles.Preview}>
                            <img className={styles.PhotoPreview}src={URL.createObjectURL(image)} alt="preview" />
                            <button className={styles.CancelPreview} onClick={clearImageHandler}>Remove</button>
                        </div>
                        
                        :<div>
                            <label htmlFor="file-upload" className={styles.FileUpload}>
                                Upload Photo  <FontAwesomeIcon className={styles.ProfileIcon} icon={['fas', 'image']} />
                            </label>
                            <input id="file-upload"type="file" onChange={imageChangeHandler} accept="png jpg jpeg" />
                        </div>}
                        <div className={styles.UpdateButtons}>
                            <button className={styles.UpdateButton} type="submit">Upload</button>
                            <button 
                                className={styles.CancelButton} 
                                onClick={() =>{
                                    setUpdateProfilePhotoShown(false)
                                    setAccountInfoShown(true)
                                    setHeaderName('Account Settings')
                                }}>Cancel</button>
                        </div>
                </form> 
                : null }
            {/* End of Edit Profile Photo Form JSX */}
            </div>        
        </div>
    )
}

export default Account

  