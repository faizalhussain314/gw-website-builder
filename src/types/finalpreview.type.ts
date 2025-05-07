export interface ImageFailure {
  selector: string;
  payload: Payload;
  error?: ErrorInfo;
}

export interface Payload {
  selector: string;
  content: Record<string, unknown>;
  business_name: string;
  template_name: string;
  services_provided: string;
  customer_steps: string;
  website_category: string;
  page_name: string;
  template_id: number;
  style_prompt: string;
}

export interface ErrorInfo {
  message: string;
}
