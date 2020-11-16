import { BehaviorSubject } from 'rxjs';
import { useSnackbar } from 'notistack';
import axios from 'axios'
import AuthHeader from '../Utilities/Auth-Header'


const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem('currentUser'))
);

export const AuthenticationService = {
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
};

// Signup New User 
export const SignupHandler = () => {
    const { enqueueSnackbar } = useSnackbar()


    const signup = async(name, email, password) => {
        try {
            const user = await axios({
                method:'POST',
                url:'/users',
                data: {
                    name,
                    email,
                    password
                }
            })

            if (user.data === 'Account Registered') {
                enqueueSnackbar('Account Registered', {
                    variant:'error'
                }) 
                return
            }
            localStorage.setItem('currentUser', JSON.stringify(user.data))
            currentUserSubject.next(user.data);
            return user.data;
        } catch (err) {
            if (err) {
                enqueueSnackbar('Must Fill Out All Fields', {
                    variant:'error'
                })
            } else {
                enqueueSnackbar('Failed to Register', {
                    variant: 'error',
                });
            }
        }
    }
    return signup
}




// Login Existing user 
export const LoginHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

    const login = async (email, password) => {
        try {
            const user = await axios({
                method:'POST',
                url:'/users/login',
                data: {
                    email,
                    password
                }
            })

            localStorage.setItem('currentUser', JSON.stringify(user.data));
            currentUserSubject.next(user.data);
            return user.data;
        } catch (err) {
            enqueueSnackbar('Failed to Login', {
                variant: 'error',
            });
        }
    }
    return login
}

// Logout Authenticated User
export const LogoutHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

    const logout = async (token) => {
        try {    
            await axios({
            method:'POST',
            url:'/users/logout',
            headers: AuthHeader(token)
    
        })
            localStorage.removeItem('currentUser');
            currentUserSubject.next(null);
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Failed to Logout', {
                variant: 'error',
            });
        }
    }
    return logout

}


export const UpdateAccountNameHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

     const updateAccountName = async (token, name) => {
        try {
            const response = await axios ({
                method: 'PATCH',
                url: '/users/me',
                headers: AuthHeader(token),
                data: {
                    name
                }
            })
            let user = JSON.parse(localStorage['currentUser'])
            user.user.name = name
            localStorage['currentUser'] = JSON.stringify(user)
            currentUserSubject.next(response.data);
        
        } catch (err) {
            enqueueSnackbar(`${err.message}`, {
                variant: 'error',
            });
        }
    }
    return updateAccountName
}

export const UpdateAccountEmailHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

     const updateAccountEmail = async (token, email) => {
        try {
            const response = await axios ({
                method: 'PATCH',
                url: '/users/me',
                headers: AuthHeader(token),
                data: {
                    email
                }
            })
            let user = JSON.parse(localStorage['currentUser'])
            user.user.email = email
            localStorage['currentUser'] = JSON.stringify(user)
            currentUserSubject.next(response.data);
        
        } catch (err) {
            console.log(err)
            enqueueSnackbar(`${err.message}`, {
                variant: 'error',
            });
        }
    }
    return updateAccountEmail
}


export const UpdateAccountPasswordHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

     const updateAccountPassword = async (token, password) => {
        try {
             await axios ({
            method: 'PATCH',
            url: '/users/me',
            headers: AuthHeader(token),
            data: {
                password
            }
        })
        } catch (err) {
            console.log(err)
            enqueueSnackbar(`${err.message}`, {
                variant: 'error',
            });
        }
        
    }
    return updateAccountPassword
}


