// frontend/src/services/campaignService.js
import api from "./api";

const getCampaigns = async () => {
    const response = await api.get("/campaigns");
    return response.data;
};

const getCampaignById = async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
};

const createCampaign = async (campaignData) => {
    const response = await api.post("/campaigns", campaignData);
    return response.data;
};

const updateCampaign = async (id, campaignData) => {
    const response = await api.put(`/campaigns/${id}`, campaignData);
    return response.data;
};

const deleteCampaign = async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
};

const campaignService = {
    getCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
};

export default campaignService;