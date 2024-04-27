export const formatWeekDataFromUser = (user) => {
    if(user.length === 0){
        return []
    }
    const lastMonth = user.calendar.length - 1;

    return user.calendar[lastMonth].map(item => {
        return item.reduce((acc, activity) => ({
            ...acc,
            [activity.learnedTool]: (acc[activity.learnedTool] ?? 0) + 1 + Math.round(Math.random() * 10)
        }), {})
    })
}

export const formatYearDataFromUser = (user) => {
    if(user.length === 0){
        return []
    }

    return [0,1,2,3,4,5,6,7].map((item, index) => {
        console.log(item)
        return ({
            ['' + item]: item + 1 + Math.round(Math.random() * 10)
        })
    })

    return user.calendar.map((item, index) => {
        return ({
            [index + '']: item.length
        })
    })
}