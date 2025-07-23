export interface JntTrackingDetail {
  actual_amount: number;
  delivDriver: {
    id: string;
    name: string;
    phone: string;
    photo: string;
  };
  detail_cost: {
    add_cost: number;
    cod: number;
    insurance_cost: number;
    return_cost: number;
    shipping_cost: number;
  };
  driver: {
    name: string;
  };
  itemname: string;
  note: string;
  qty: number;
  receiver: {
    addr: string;
    city: string;
    geoloc: string;
    name: string;
    zipcode: string;
  };
  sender: {
    addr: string;
    city: string;
    geoloc: string;
    name: string;
    zipcode: string;
  };
  services_code: string;
  services_type: string;
  shipped_date: string;
  weight: number;
}

export interface JntTrackingHistory {
  agentName: string;
  city_name: string;
  date_time: string;
  driverName: string;
  driverPhone: string;
  nextSiteName: string;
  note: string;
  presenter: string;
  presentername: string;
  receiver: string;
  status: string;
  status_code: number;
  storeName: string;
  distributionFlag?: string;
}

export interface JntTrackingResponse {
  awb: string;
  detail: JntTrackingDetail;
  history: JntTrackingHistory[];
  orderid: string;
}

export interface JntTrackingApiResponse {
  success: boolean;
  data: {
    status: string;
    data: JntTrackingResponse;
  };
}
