import { ADD_USER, ALL_TEACHERS, ALL_USERS, CONFIRM_EMAIL, DELETE_USER, EDIT_USER } from "./endpoints";

export const getAllUsers = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + ALL_USERS);
    const data = await response.json();
    return data;
}

export const getAllTeachers = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + ALL_TEACHERS);
    const data = await response.json();
    return data;
}

export const deleteUser = async (userID) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + DELETE_USER, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: userID
        })
    })
    const data = await response.text();
    return data;
}

export const addUser = async (user) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + ADD_USER, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    const data = await response.text();
    return data;
}

export const editUser = async (user) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + EDIT_USER, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    const data = await response.text();
    return data;
}

export const confirmEmail = async (email) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + CONFIRM_EMAIL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({login: email})
    })
    const data = await response.json();
    return data;
}

export const createAccount = async (user) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + CONFIRM_EMAIL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({...user})
    })
    const data = await response.json();
    return data;
}