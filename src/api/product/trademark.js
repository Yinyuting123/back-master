import request from '@/utils/request'

export const reqTrademarkList = (page, limit) => request({ 
    url: `/admin/product/baseTrademark/${page}/${limit}`, 
    method: 'get' 
});

// 新增品牌
export const reqSaveTrademark = (banner) => request({ 
    url: `/admin/product/baseTrademark/save`, 
    method: 'post',
    data: banner
});

// 修改品牌
export const reqUpdateTrademark = (baseTrademark) => request({ 
    url: `/admin/product/baseTrademark/update`, 
    method: 'put',
    data: baseTrademark
});
