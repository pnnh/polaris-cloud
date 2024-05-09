export class ArticleModel {
  uid = ''
  urn = ''
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
}

export class TocItem {
  title = ''
  header = 0
  id = ''
}