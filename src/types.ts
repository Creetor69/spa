export interface PricingOption {
  name: string;
  duration: string;
  price: string;
}

export interface Service {
  id: string;
  name: string;
  duration?: string;
  benefits: string[];
  description: string;
  price?: string;
  category: string;
  options?: PricingOption[];
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  role: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  description: string;
}

