export type Complexity = 'Starter' | 'Intermediate' | 'Advanced'
export type PreviewState = 'default' | 'hover' | 'focus' | 'pressed' | 'disabled' | 'loading' | 'error' | 'success'

export interface ComponentConfig {
  label: string
  accent: string
  radius: number
  padding: number
  weight: number
  speed: number
  variant: string
  shadow: boolean
  icon: boolean
}

export interface CatalogItem {
  slug: string
  title: string
  category: string
  description: string
  tags: string[]
  complexity: Complexity
  animated: boolean
  added: string
  variants: string[]
  states: PreviewState[]
  controls: (keyof ComponentConfig)[]
  dependencies: string[]
  keyboard: string
  accessibility: string
  previewFit?: 'compact' | 'wide' | 'tall' | 'overlay-safe'
  defaultConfig: ComponentConfig
}

export interface SavedPreset {
  id: string
  name: string
  slug: string
  config: ComponentConfig
  createdAt: string
}
