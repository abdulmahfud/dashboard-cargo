export interface Province {
  id: number;
  name: string;
}

export interface Regency {
  id: number;
  name: string;
  province_id: number;
}

export interface District {
  id: number;
  name: string;
  regency_id: number;
}

export interface Subdistrict {
  id: number;
  name: string;
  district_id: number;
}

export interface PostalCode {
  id: number;
  label: string;
  value: number;
  code: number;
  subdistrict_id: number;
  district_id: number;
  regency_id: number;
  province_id: number;
}

export interface AddressSearchResponse {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
  subdistricts: Subdistrict[];
  postal_codes: PostalCode[];
}

export interface SearchResult {
  subdistrict: Subdistrict;
  district?: District;
  regency?: Regency;
  province?: Province;
  postal_code: PostalCode;
}
 