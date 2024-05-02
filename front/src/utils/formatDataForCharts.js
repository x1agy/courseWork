export const formatWeekDataFromUser = (user) => {
    if(user.length === 0){
        return []
    }

    if(!user?.calendar){
        return []
    }
    const lastMonth = user.calendar.length - 1;

    return user.calendar[lastMonth].map(item => {
        return item.reduce((acc, activity) => ({
            ...acc,
            [activity.learnedTool]: (acc[activity.learnedTool] ?? 0) + 1
        }), {})
    })
}

export const formatYearDataFromUser = (user) => {
    if(user.length === 0){
        return []
    }

    if(!user?.calendar){
        return []
    }

    // return [0,1,2,3,4,5,6,7].map((item, index) => {
    //     return ({
    //         ['' + item]: item + 1 + Math.round(Math.random() * 10)
    //     })
    // })

    return user.calendar.map((item, index) => {
        return ({
            [index + '']: item.length
        })
    })
}