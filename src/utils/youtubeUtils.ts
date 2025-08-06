/**
 * 다양한 YouTube URL 형식에서 비디오 ID를 추출합니다.
 * @param url YouTube URL
 * @returns 비디오 ID 또는 null
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null

  // YouTube URL 패턴들
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  // URL이 이미 비디오 ID인지 확인 (11자리 문자열)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }

  return null
}

/**
 * YouTube 썸네일 URL을 생성합니다.
 * @param videoId YouTube 비디오 ID
 * @param quality 썸네일 품질 ('default', 'medium', 'high', 'standard', 'maxres')
 * @returns 썸네일 URL
 */
export const getYouTubeThumbnail = (
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'
): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
}
