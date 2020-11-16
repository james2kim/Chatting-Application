import AuthHeader from '../Utilities/Auth-Header'
import { useSnackbar } from 'notistack'
import axios from 'axios'


// Function to get list of users
export const GetUsersHandler = () => {
    const { enqueueSnackbar } = useSnackbar()

    const getUsers = async (token) => {
        try {
            let response = await axios({
                method:'GET',
                url:'/users',
                headers: AuthHeader(token),
            })

            response = response.data.sort((a,b) => {
                let fa = a.name.toLowerCase(),
                fb = b.name.toLowerCase();
                if (fa < fb) return -1;
                if (fa > fb) return 1;
                return 0;
            })
            return response
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could not load Users', {
                variant: 'error',
            })
        }
    }
    return getUsers
}

// Function to get account information 
export const GetAccountHandler = () => {
    const { enqueueSnackbar } = useSnackbar()

    const getAccount = async (token, id) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `/users/${id}`,
                headers: AuthHeader(token)
            })
            return response.data
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Could not load Account Information', {
                variant: 'error',
            })
        }
    }
    return getAccount
}

// Function to upload a profile photo 
export const UploadProfilePhotoHandler = () => {
    const { enqueueSnackbar } = useSnackbar()

    const uploadPhoto = async (token, image) => {
        let avatar = new FormData()
        avatar.append('avatar', image)
  
        try {
          await axios({
                method:'POST',
                url: '/users/me/avatar',
                headers: {
                    ...AuthHeader(token),
                    'Content-Type': 'multipart/form-data',
                },
                data: avatar
            })

            let user = JSON.parse(localStorage['currentUser'])
            user.user.avatar = avatar
            localStorage['currentUser'] = JSON.stringify(user)
        
     
        } catch (err) {
            enqueueSnackbar('Unable to Upload Photo', {
                variant: 'error',
            })
        }
    }
    return uploadPhoto;
}
