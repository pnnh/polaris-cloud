'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {MarkdownEditorForm} from '../../partials/edit'
import {clientMakeHttpGet, clientMakeHttpPut} from '@/services/client/http'
import {NoteModel} from "@/models/personal/note";

interface IReadRequest {
    params: { pk: string }
}

export default function Page(request: IReadRequest) {
    const pk = request.params.pk
    const [model, setModel] = useState<NoteModel>()
    const router = useRouter()

    useEffect(() => {
        clientMakeHttpGet<NoteModel | undefined>('/posts/' + pk).then((result) => {
            if (result) {
                setModel(result)
            }
        })
    }, [pk])
    if (!model || !model.body) {
        return null
    }

    return <MarkdownEditorForm model={model} onSubmit={(newModel) => {
        if (!newModel) {
            return
        }

        clientMakeHttpPut<NoteModel>('/restful/article', newModel).then((result) => {
            console.debug('result', result)
            if (result && result.uid) {
                router.replace('/console/articles')
                router.refresh()
            }
        })
    }}/>
}
