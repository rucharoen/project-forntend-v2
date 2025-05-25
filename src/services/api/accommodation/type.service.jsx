import axios from "axios";
import AuthHeader from "../../common/AuthHeader";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAll = async () => {
    return await axios.get(`${BASE_URL}/api/accommodation/type`);
};

const getById = async (id) => {
    return await axios.get(`${BASE_URL}/api/accommodation/type/${id}`);
}
const TypeService = {
    getAll,
    getById
}


export default TypeService;