import axios from "axios";
const API_URL = "http://localhost:5038/api/categories";

export const getCategories = async () => (await axios.get(API_URL)).data;
