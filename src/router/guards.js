beforeEnter: (to, from, next) => {

    const user =
        JSON.parse(localStorage.getItem('user'))

    if (!user) {
        next('/signin')
    } else {
        next()
    }
}