import axios from "axios"
import { constant } from "constant"

const token = localStorage.getItem("token") || sessionStorage.getItem("token");


export const postApi = async (path, data) => {
    try {
        let result = await axios.post(constant.baseUrl + path, data, {
            headers: {
                Authorization: token
            }
        })
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('user', JSON.stringify(result.data?.user))
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}
export const putApi = async (path, data, id) => {
    try {
        let result = await axios.put(constant.baseUrl + path, data, {
            headers: {
                Authorization: token
            }
        })
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const deleteApi = async (path, id) => {
    try {
        let result = await axios.delete(constant.baseUrl + path + id, {
            headers: {
                Authorization: token
            }
        })
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('token', result.data?.token)
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const deleteManyApi = async (path, data) => {
    try {
        let result = await axios.post(constant.baseUrl + path, data, {
            headers: {
                Authorization: token
            }
        })
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('token', result.data?.token)
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const getApi = async (path, id) => {
    try {
        if (id) {
            let result = await axios.get(constant.baseUrl + path + id, {
                headers: {
                    Authorization: token
                }
            })
            return result
        }
        else {
            let result = await axios.get(constant.baseUrl + path, {
                headers: {
                    Authorization: token
                }
            })
            return result
        }
    } catch (e) {
        console.error(e)
    }
}

