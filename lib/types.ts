// 地域情報
export interface Region {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  population: number;
  features: string[];
  infrastructure: {
    schools: number;
    hospitals: number;
    supermarkets: number;
    stations: number;
  };
  internetSpeed: string;
  community: string;
  subsidies: string[];
}

// 物件情報
export interface Property {
  id: string;
  title: string;
  regionId: string;
  prefecture: string;
  city: string;
  address: string;
  price: number;
  landArea: number;
  buildingArea: number;
  rooms: string;
  age: number;
  structure: string;
  condition: string;
  features: string[];
  images: {
    main: string;
    sub: string[];
    beforeRenovation?: string;
    afterRenovation?: string;
  };
  renovationCost?: number;
  demolitionCost?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyFacilities: {
    station?: string;
    school?: string;
    hospital?: string;
    supermarket?: string;
  };
  description: string;
}

// 診断の質問
export interface DiagnosisQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options?: {
    value: string;
    label: string;
  }[];
  weight: number;
}

// 診断結果
export interface DiagnosisResult {
  lifestyle: string[];
  workStyle: string[];
  priorities: string[];
  budget: {
    min: number;
    max: number;
  };
  preferredRegions: string[];
}

// お問い合わせ
export interface Inquiry {
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  type: 'viewing' | 'consultation' | 'information';
  preferredDate?: string;
}