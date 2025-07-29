const fetchData = (req, res) => {
    res.render('signup')
}

const loginPage = (req, res) => {
    res.render('login')
}

module.exports = {
    fetchData,
    loginPage
}
