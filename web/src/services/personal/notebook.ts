import axios from '~/axios/index'
import { PLSelectResult } from '@/models/common-result'
import { NotebookModel } from '@/models/personal/notebook'

export class NotebookService {

   static async selectNotebooks (library: string, queryString: string = '') {
    const url = `/server/console/libraries/${library}/notebooks?${queryString}`
    const response = await axios.get<PLSelectResult<NotebookModel>>(url)
    return response.data
}

}