// 文章评论相关模块
import request from '@/utils/request'

//取消点赞文章
export const getComments = params => {
    return request({
        method: 'GET',
        url: `/app/v1_0/comments`,
        params
    })
}

//点赞文章评论
export const addCommentLike = commentId => {
    return request({
        method: 'POST',
        url: `/app/v1_0/comment/likings`,
        data: {
            target: commentId
        }
    })
}
//取消点赞文章评论
export const deleteCommentLike = commentId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/comment/likings/${commentId}`,

    })
}

//添加评论或评论回复
export const addComment = data => {
    return request({
        method: 'POST',
        url: `/app/v1_0/comments`,
        data
    })
}