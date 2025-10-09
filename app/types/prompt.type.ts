export enum PromptType {
  Image = 'prompt::type::image',
  Video = 'prompt::type::video',
}

export enum PlaceholderType {
  Text = 'text',
  Image = 'image',
}

export type Placeholder = {
  id: string
  label: string
  type: PlaceholderType
  value: string
}
