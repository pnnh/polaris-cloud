export class ArticleModel {
  pk = ''
  title = ''
  header = ''
  body = ''
  create_time: Date = new Date()
  update_time: Date = new Date()
  creator = ''
  keywords = ''
  description = ''
  cover = ''
  name = ''
  discover = 0
  profile = ''
  profile_name = ''
  channel = ''
  channel_name = ''
  partition = ''
  path = ''
  url_name = ''
}

// Deprecated
export class SelectResultModel {
  count = 0
  list: ArticleModel[] = []
}

export class TocItem {
  title = ''
  header = 0
  id = ''
}
