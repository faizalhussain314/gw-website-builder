export interface StepDetail {
  id: string;
  title: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
}

export type GetDomainFromEndpointType = (endpoint: string) => string;
