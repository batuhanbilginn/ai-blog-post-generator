export interface SubheadingI {
  heading: string
  id: string
}
export interface OutlineItemI {
  title: string
  subheadings: SubheadingI[]
  id: string
}
export interface OutlineI {
  title: string
  outline: OutlineItemI[]
}

export interface PostI {
  title: string
  content: string
}
