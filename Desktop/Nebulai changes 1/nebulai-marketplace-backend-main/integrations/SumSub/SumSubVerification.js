const axios = require("axios");
const FormData = require("form-data");
const crypto = require("crypto");

class SumSubAPI {
  constructor() {
    this.SUMSUB_APP_TOKEN = process.env.SUMSUB_TOKEN;
    this.SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
    this.SUMSUB_BASE_URL = "https://api.sumsub.com";

    // Create a new Axios instance
    this.axiosInstance = axios.create({
      baseURL: this.SUMSUB_BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-App-Token": this.SUMSUB_APP_TOKEN,
      },
    });

    // Add a request interceptor to modify headers and set X-App-Access-Ts
    this.axiosInstance.interceptors.request.use((config) => {
      console.log("Creating a signature for the request...");
      const ts = Math.floor(Date.now() / 1000);
      const signature = crypto.createHmac("sha256", this.SUMSUB_SECRET_KEY);
      signature.update(ts + config.method.toUpperCase() + config.url);

      if (config.data instanceof FormData) {
        signature.update(config.data.getBuffer());
      } else if (config.data) {
        signature.update(JSON.stringify(config.data));
      }

      const headers = {
        ...config.headers,
        "X-App-Access-Ts": ts,
        "X-App-Access-Sig": signature.digest("hex"),
      };

      return {
        ...config,
        headers: headers,
      };
    });
  }

  async createApplicantPub(externalUserId, levelName = "basic-kyc-level") {
    try {
      const config = this.createApplicantConfig(externalUserId, levelName);
      const resp = await this.axiosInstance.request(config);
      return resp.data;
    } catch (err) {
      throw err;
    }
  }

  createApplicantConfig(externalUserId, levelName = "basic-kyc-level") {
    const method = "POST";
    const url = `/resources/applicants?levelName=${encodeURIComponent(
      levelName
    )}`;
    const body = {
      externalUserId: externalUserId,
    };

    return {
      method: method,
      url: url,
      data: body,
    };
  }

  async addDocumentPub(applicantId, metadata, idDoc) {
    try {
      const config = this.addDocumentConfig(applicantId, metadata, idDoc);
      const resp = await this.axiosInstance.request(config);
      return resp.data;
    } catch (err) {
      throw err;
    }
  }

  addDocumentConfig(applicantId, metadata, idDoc) {
    const method = "POST";
    const url = `/resources/applicants/${applicantId}/info/idDoc`;

    const form = new FormData();
    form.append("metadata", JSON.stringify(metadata));
    form.append("content", idDoc?.buffer, idDoc?.originalname);

    return {
      method: method,
      url: url,
      data: form,
      headers: form.getHeaders(),
    };
  }

  async getApplicantStatus(applicantId) {
    try {
      const method = "GET";
      const url = `/resources/applicants/${applicantId}/status`;
      const resp = await this.axiosInstance.request({
        method: method,
        url: url,
      });
      return resp.data;
    } catch (err) {
      throw err;
    }
  }

  async createAccessToken(
    externalUserId,
    ttlInSecs = 600,
    levelName = "basic-kyc-level"
  ) {
    try {
      console.log("Creating an access token for initializing SDK...");
      var method = "post";
      var url =
        "/resources/accessTokens?userId=" +
        encodeURIComponent(externalUserId) +
        "&ttlInSecs=" +
        ttlInSecs +
        "&levelName=" +
        encodeURIComponent(levelName);

      const resp = await this.axiosInstance.request({
        method: method,
        url: url,
      });
      return resp.data;
    } catch (err) {
      throw err;
    }
  }

  async getRequiredIdDocsStatus(applicantId) {
    try {
      var method = "GET";
      var url = `/resources/applicants/${applicantId}/requiredIdDocsStatus`;
      const resp = await this.axiosInstance.request({
        method: method,
        url: url,
      });
      return resp.data;
    } catch (err) {
      throw err;
    }
  }

  
  async updateApplicantStatusToPending(applicantId, reason = "") {
    try {
      var method = "POST";
      var url = `/resources/applicants/${applicantId}/status/pending?reason=${encodeURIComponent(
        reason
      )}`;
      await this.axiosInstance.request({
        method: method,
        url: url,
      });
      return true;
    } catch (err) {
      console.log('updateApplicantStatusToPending: ', err?.message)
    }
    return false;
  }
}

module.exports = SumSubAPI;
