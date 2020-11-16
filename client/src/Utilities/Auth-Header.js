const AuthHeader = (token) => {
    return {
        Authorization: `Bearer ${token}`
    }
}

export default AuthHeader