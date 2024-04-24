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