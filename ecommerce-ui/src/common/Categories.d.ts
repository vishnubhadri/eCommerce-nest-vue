export interface Categories {
  data: Array<{ id: string; name: string }>
  page: number
  total_page: number
}

export interface Category {
  id: string
  name: string
}
