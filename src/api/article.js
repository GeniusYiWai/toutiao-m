// 文章请求相关api
import request from '@/utils/request'

// 获取文章列表
export const getArticles = params => {
    return request({
        method: 'GET',
        url: `/app/v1_1/articles`,
        params
    })
}

// 获取文章详情
export const getArticleById = id => {
    return request({
        method: 'GET',
        url: `/app/v1_0/articles/${id}`,

    })
}




//收藏文章
export const addCollect = articleId => {
    return request({
        method: 'POST',
        url: `/app/v1_0/article/collections`,
        data: {
            target: articleId
        }
    })
}
//取消收藏文章
export const deleteCollect = articleId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/article/collections/${articleId}`,
    })
}


//点赞文章
export const addLike = articleId => {
    return request({
        method: 'POST',
        url: `/app/v1_0/article/likings`,
        data: {
            target: articleId
        }
    })
}
//取消点赞文章
export const deleteLike = articleId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/article/likings/${articleId}`,
    })
}
