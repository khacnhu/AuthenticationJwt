

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({ sucess: true, user, token });
  };



  const sendRefreshTokenAndToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const refreshtoken = user.getSignedJwtRefreshToken()

    res.status(statusCode).json({ sucess: true, user, token, refreshtoken });
};

module.exports = {
    sendToken,
    sendRefreshTokenAndToken
}