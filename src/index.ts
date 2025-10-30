import { v4 as uuidv4 } from "uuid";
import axios from "axios";

class Analytics4 {
  private trackingID: string;
  private secretKey: string;
  private clientID: string;
  private sessionID: string;
  private customParams: Record<string, unknown> = {};
  private userProperties: Record<string, unknown> | null = null;

  private baseURL: string = "https://google-analytics.com/mp";
  private collectURL = "/collect";

  constructor(
    trackingID: string,
    secretKey: string,
    clientID: string = uuidv4(),
    sessionID = uuidv4(),
    baseURL?: string
  ) {
    this.trackingID = trackingID;
    this.secretKey = secretKey;
    this.clientID = clientID;
    this.sessionID = sessionID;
    this.baseURL = baseURL ?? this.baseURL;
  }

  set(key: string, value: any) {
    if (value !== null) {
      this.customParams[key] = value;
    } else {
      delete this.customParams[key];
    }

    return this;
  }

  setParams(params?: Record<string, unknown>) {
    if (typeof params === "object" && Object.keys(params).length > 0) {
      Object.assign(this.customParams, params);
    } else {
      this.customParams = {};
    }

    return this;
  }

  setUserProperties(upValue?: Record<string, unknown>) {
    if (typeof upValue === "object" && Object.keys(upValue).length > 0) {
      this.userProperties = upValue;
    } else {
      this.userProperties = null;
    }

    return this;
  }

  event(eventName: string): Promise<any> {
    const payload = {
      client_id: this.clientID,
      events: [
        {
          name: eventName,
          params: {
            session_id: this.sessionID,
            ...this.customParams,
          },
        },
      ],
    };

    if (this.userProperties) {
      Object.assign(payload, { user_properties: this.userProperties });
    }

    return axios.post(
      `${this.baseURL}${this.collectURL}?measurement_id=${this.trackingID}&api_secret=${this.secretKey}`,
      payload
    );
  }
}

module.exports = Analytics4;
module.exports.default = Analytics4;
