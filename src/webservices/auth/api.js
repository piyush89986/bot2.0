import endpointUrls from "../endpointUrls";
import apiRequestHandler from "../getway";

export async function getProfile() {
    let response = await apiRequestHandler("get", endpointUrls.ME);
    return response;
}


export async function updateUser(data) {
    let response = await apiRequestHandler("patch", endpointUrls.UPDATE_USER,data);
    return response;
}


export async function uploadProfile(data) {
    let response = await apiRequestHandler("patch", endpointUrls.UPLOAD_USER_PROFILE, data, {}, {
        "Content-Type": "multipart/form-data"
    });
    return response;
}