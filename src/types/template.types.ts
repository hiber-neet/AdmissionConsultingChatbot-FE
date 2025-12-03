// Template types - matching backend schema exactly
export interface TemplateField {
  field_name: string;
  order_field: number;
  field_type: string;
  template_field_id?: number;
  template_id?: number;
}

export interface Template {
  template_name: string;
  template_id?: number;
  is_active?: boolean;
  created_by?: number;
  template_fields: TemplateField[];
}

// Template creation and update types
export interface TemplateCreate {
  template_name: string;
  template_fields: Omit<TemplateField, 'template_field_id' | 'template_id'>[];
}

export interface TemplateUpdate {
  template_name?: string;
  template_fields?: Omit<TemplateField, 'template_field_id' | 'template_id'>[];
}

