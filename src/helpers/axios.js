import axios from "axios";
import router from "../router/index.js";


export async function useApi({...args}) {
    try {
        const response = await axios({
            method: args.method,
            data: args.data,
            params: args.params,
            headers: {
                ...args.header,
                "Content-Type": "application/json",
                Authorization: `Bearer ${args.token}`,
            },
            baseURL: import.meta.env.VITE_APP_API_BASE + args.api,
        });
        return {ok: true, data: response.data};
    } catch (error) {
        if (error.response.status === 401) {
            router.push('/signin');
        }
        return {ok: false, error: error.response};
    }
}

const useAPIPost = async (route, payload, token) => {
    const apibase = import.meta.env.VITE_APP_API_BASE;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const data = [];
    try {
        await axios.post(`${apibase}${route}`, payload, config).then((res) => {
            data.push(res.data.response);
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};
const apibase = import.meta.env.VITE_APP_API_BASE;
const useAPIGet = async (route, token) => {
    const config = {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    const data = [];
    try {
        await axios.get(`${apibase}${route}`, config).then((res) => {
            data.push(res.data.response);
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};
const useOpenAPIget = async (url) => {
    const data = [];
    try {
        await axios.get(url).then((res) => {
            data.push(res.data);
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};
export {useAPIPost, useAPIGet, useOpenAPIget};
