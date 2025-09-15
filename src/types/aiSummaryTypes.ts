export type BlogAiSummaryRequest = {
  url: string
  category: string
}

export type BlogAiSummaryResponse = {
  text: string
  tags: string[]
  thumbnail: string
  title: string
}

export type VideoAiSummaryResponse = {
  text: string
  tags: string[]
}

export type KnowledgeAiTitleResponse = {
  title: string
  tags: string[]
}
